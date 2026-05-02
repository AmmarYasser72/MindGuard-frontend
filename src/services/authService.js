import { storage } from "./storage.js";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const SESSION_KEY = "auth_session";
const USERS_KEY = "auth_users";
const DEFAULT_AUTH_TIMEOUT_MS = 2200;
const configuredTimeout = Number(import.meta.env.VITE_AUTH_TIMEOUT_MS);
const AUTH_TIMEOUT_MS = Number.isFinite(configuredTimeout) && configuredTimeout > 0
  ? configuredTimeout
  : DEFAULT_AUTH_TIMEOUT_MS;

const demoUsers = [
  {
    uid: "demo-patient-001",
    email: "patient@demo.com",
    password: "demo123",
    displayName: "Demo Patient",
    role: "patient",
  },
  {
    uid: "demo-doctor-001",
    email: "doctor@demo.com",
    password: "demo123",
    displayName: "Demo Doctor",
    role: "doctor",
  },
];

function savedUsers() {
  const users = storage.get(USERS_KEY, []);
  const emails = new Set(users.map((user) => user.email));
  return [...users, ...demoUsers.filter((user) => !emails.has(user.email))];
}

function removePassword(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function findLocalUser(email, password) {
  return savedUsers().find(
    (item) => item.email.toLowerCase() === email && item.password === password,
  );
}

function persistSession(user, token = "local-demo-token") {
  const session = { token, user };
  storage.set(SESSION_KEY, session);
  return user;
}

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);
  const { headers, ...fetchOptions } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: { "Content-Type": "application/json", ...(headers || {}) },
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw createHttpError(data.message || data.error || "Request failed", response.status);
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("Authentication server took too long to respond");
      timeoutError.code = "AUTH_TIMEOUT";
      throw timeoutError;
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timer);
  }
}

function roleFromEmail(email) {
  return email.includes("doctor") || email.startsWith("dr.") ? "doctor" : "patient";
}

function profilePayload(data) {
  if (!data || typeof data !== "object") return null;
  const candidate = data.user || data.profile || data.data?.user || data.data?.profile || data.data || data;
  if (!candidate || typeof candidate !== "object") return null;
  const hasProfileField = candidate.id
    || candidate.uid
    || candidate._id
    || candidate.email
    || candidate.name
    || candidate.displayName
    || candidate.role;
  return hasProfileField ? candidate : null;
}

function authToken(data) {
  return data?.token || data?.accessToken || data?.access_token || data?.data?.token || data?.data?.accessToken || data?.data?.access_token;
}

function normalizeProfile(data, fallback = {}) {
  return {
    uid: data.id || data.uid || data._id || fallback.uid || crypto.randomUUID(),
    email: data.email || fallback.email,
    displayName: data.name || data.displayName || fallback.displayName || fallback.email,
    role: data.role || fallback.role || "patient",
  };
}

function canUseLocalFallback(error) {
  return error.code === "AUTH_TIMEOUT"
    || error.name === "TypeError"
    || error.message === "Failed to fetch"
    || error.status === 404
    || error.status >= 500;
}

async function fetchProfile({ token, role, fallback }) {
  const profilePath = role === "doctor" ? "/api/doctor/profile" : "/api/patient/profile";
  try {
    const profile = await request(profilePath, {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });
    return normalizeProfile(profilePayload(profile) || profile, { ...fallback, role });
  } catch {
    return normalizeProfile({}, { ...fallback, role });
  }
}

function createLocalUser(profile, cleanEmail) {
  const user = {
    uid: crypto.randomUUID(),
    email: cleanEmail,
    password: profile.password,
    displayName: profile.role === "doctor"
      ? `Dr. ${profile.firstName} ${profile.lastName}`
      : `${profile.firstName} ${profile.lastName}`,
    role: profile.role,
  };
  const stored = storage.get(USERS_KEY, []);
  storage.set(USERS_KEY, [...stored, user]);
  return removePassword(user);
}

export const authService = {
  getCurrentUser() {
    return storage.get(SESSION_KEY)?.user || null;
  },

  async signIn(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const localUser = findLocalUser(cleanEmail, password);
    if (localUser) {
      return persistSession(removePassword(localUser));
    }

    try {
      const auth = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const token = authToken(auth);
      const fallback = { email: cleanEmail, role: roleFromEmail(cleanEmail) };
      const authProfile = profilePayload(auth);
      if (authProfile) {
        return persistSession(normalizeProfile(authProfile, fallback), token);
      }
      const role = authProfile?.role || fallback.role;
      const profile = await fetchProfile({ token, role, fallback });
      return persistSession(profile, token);
    } catch (error) {
      if (canUseLocalFallback(error)) {
        throw new Error("Invalid email or password");
      }
      throw new Error(error.message || "Invalid email or password");
    }
  },

  async register(profile) {
    const cleanEmail = profile.email.trim().toLowerCase();
    const body = {
      email: cleanEmail,
      password: profile.password,
      confirmPassword: profile.password,
      name: `${profile.firstName} ${profile.lastName}`,
      role: profile.role,
      gender: profile.gender.toLowerCase(),
      specialization: profile.specialization || undefined,
      licenseNumber: profile.licenseNumber || undefined,
      yearsOfExperience: profile.yearsOfExperience
        ? Number(profile.yearsOfExperience)
        : undefined,
    };
    const fallback = { email: cleanEmail, displayName: body.name, role: profile.role };

    try {
      const auth = await request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const token = authToken(auth);
      const authProfile = profilePayload(auth);
      if (authProfile) {
        return persistSession(normalizeProfile(authProfile, fallback), token);
      }
      const remoteProfile = await fetchProfile({ token, role: profile.role, fallback });
      return persistSession(remoteProfile, token);
    } catch (error) {
      if (!canUseLocalFallback(error)) {
        throw new Error(error.message || "Registration failed");
      }
      const users = savedUsers();
      if (users.some((user) => user.email.toLowerCase() === cleanEmail)) {
        throw new Error("Email already exists");
      }
      return persistSession(createLocalUser(profile, cleanEmail));
    }
  },

  signOut() {
    storage.remove(SESSION_KEY);
  },
};
