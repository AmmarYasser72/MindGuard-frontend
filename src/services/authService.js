import { storage } from "./storage.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const SESSION_KEY = "auth_session";
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
    displayName: "demo",
    role: "doctor",
  },
];

function savedUsers() {
  const users = storage.get(USERS_KEY, []);
  const emails = new Set(users.map((user) => user.email));
  return [...users, ...demoUsers.filter((user) => !emails.has(user.email))];
}

function persistSession(user, token = "local-demo-token") {
  const session = { token, user };
  storage.set(SESSION_KEY, session);
  return user;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
}

function normalizeProfile(data, fallback = {}) {
  return {
    uid: data.id || data.uid || data._id || fallback.uid || crypto.randomUUID(),
    email: data.email || fallback.email,
    displayName: data.name || data.displayName || fallback.displayName,
    role: data.role || fallback.role || "patient",
  };
}

export const authService = {
  getCurrentUser() {
    return storage.get(SESSION_KEY)?.user || null;
  },

  async signIn(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const auth = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const token = auth.token || auth.accessToken;
      const role = cleanEmail.includes("doctor") ? "doctor" : "patient";
      const profilePath = role === "doctor" ? "/api/doctor/profile" : "/api/patient/profile";
      const profile = await request(profilePath, {
        headers: token ? { authorization: `Bearer ${token}` } : {},
      });
      return persistSession(normalizeProfile(profile, { email: cleanEmail, role }), token);
    } catch (error) {
      const user = savedUsers().find(
        (item) => item.email.toLowerCase() === cleanEmail && item.password === password,
      );
      if (!user) {
        throw new Error(error.message === "Failed to fetch" ? "Invalid email or password" : error.message);
      }
      const { password: _password, ...safeUser } = user;
      return persistSession(safeUser);
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

    try {
      const auth = await request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const token = auth.token || auth.accessToken;
      const profilePath = profile.role === "doctor" ? "/api/doctor/profile" : "/api/patient/profile";
      const remoteProfile = await request(profilePath, {
        headers: token ? { authorization: `Bearer ${token}` } : {},
      });
      return persistSession(normalizeProfile(remoteProfile, { email: cleanEmail, role: profile.role }), token);
    } catch {
      const users = savedUsers();
      if (users.some((user) => user.email.toLowerCase() === cleanEmail)) {
        throw new Error("Email already exists");
      }
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
      const { password: _password, ...safeUser } = user;
      return persistSession(safeUser);
    }
  },

  signOut() {
    storage.remove(SESSION_KEY);
  },
};
