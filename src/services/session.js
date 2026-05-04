import { storage } from "./storage.js";

export const SESSION_KEY = "auth_session";

export function getSession() {
  return storage.get(SESSION_KEY);
}

export function setSession(session) {
  storage.set(SESSION_KEY, session);
}

export function clearSession() {
  storage.remove(SESSION_KEY);
}
