import { storage } from "./storage.js";
import { request } from "./apiClient.js";
import { clearSession, getSession, setSession } from "./session.js";

const USERS_KEY = "auth_users";

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
  setSession({ token, user });
  return user;
}

function roleFromEmail(email) {
  return email.includes("doctor") || email.startsWith("dr.") ? "doctor" : "patient";
}

function authToken(data) {
  return data?.token || data?.accessToken || data?.access_token || data?.data?.token || data?.data?.accessToken || data?.data?.access_token;
}

function normalizeRole(role, fallback = "patient") {
  if (typeof role !== "string" || !role.trim()) return fallback;
  return role.toLowerCase();
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function firstObject(...values) {
  return values.find((value) => value && typeof value === "object" && !Array.isArray(value));
}

function decodeJwtPayload(token) {
  const rawToken = authToken({ token });
  const encodedToken = rawToken?.toLowerCase().startsWith("bearer ")
    ? rawToken.slice(7).trim()
    : rawToken;
  if (!encodedToken) return null;

  const payload = encodedToken.split(".")[1];
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

function normalizeProfile(data, fallback = {}) {
  return {
    uid: firstValue(data.id, data.uid, data._id, data.sub, fallback.uid, crypto.randomUUID()),
    email: firstValue(data.email, fallback.email),
    displayName: firstValue(
      data.name,
      data.displayName,
      data.fullName,
      fallback.displayName,
      fallback.email,
      "MindGuard User",
    ),
    role: normalizeRole(
      firstValue(data.role, data.userRole, data.accountType, data.type),
      fallback.role || "patient",
    ),
  };
}

function profilePayload(data) {
  if (!data || typeof data !== "object") return {};
  return firstObject(
    data.user,
    data.profile,
    data.doctor,
    data.patient,
    data.data?.user,
    data.data?.profile,
    data.data?.doctor,
    data.data?.patient,
    data.data,
    data,
  ) || {};
}

function profileFromAuth(data, fallback) {
  const token = authToken(data);
  return normalizeProfile({
    ...(decodeJwtPayload(token) || {}),
    ...profilePayload(data),
  }, fallback);
}

function createConnectionError() {
  return new Error("Couldn't reach the backend. Make sure your local backend server is running.");
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

function isConnectionError(error) {
  return error.name === "TypeError"
    || error.message === "Failed to fetch"
    || error.code === "REQUEST_TIMEOUT";
}

export const authService = {
  getCurrentUser() {
    return getSession()?.user || null;
  },

  async signIn(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const localUser = findLocalUser(cleanEmail, password);
    if (localUser) {
      return persistSession(removePassword(localUser));
    }

    try {
      const auth = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const token = authToken(auth);
      const fallback = { email: cleanEmail, role: roleFromEmail(cleanEmail) };
      return persistSession(profileFromAuth(auth, fallback), token);
    } catch (error) {
      const fallbackUser = findLocalUser(cleanEmail, password);
      if (fallbackUser && isConnectionError(error)) {
        return persistSession(removePassword(fallbackUser));
      }
      if (isConnectionError(error)) {
        throw createConnectionError();
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
      const auth = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const token = authToken(auth);
      return persistSession(profileFromAuth(auth, fallback), token);
    } catch (error) {
      if (isConnectionError(error)) {
        const users = savedUsers();
        if (users.some((user) => user.email.toLowerCase() === cleanEmail)) {
          throw new Error("Email already exists");
        }
        return persistSession(createLocalUser(profile, cleanEmail));
      }
      throw new Error(error.message || "Registration failed");
    }
  },

  signOut() {
    clearSession();
  },
};
