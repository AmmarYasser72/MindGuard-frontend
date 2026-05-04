import { getSession } from "./session.js";

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();
const DEFAULT_TIMEOUT_MS = 10000;

export const API_BASE_URL = (RAW_API_BASE_URL ? RAW_API_BASE_URL : "/api").replace(/\/$/, "");

function createHttpError(message, status, data = null) {
  const error = new Error(message);
  error.status = status;
  error.data = data;
  return error;
}

function normalizePath(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

function normalizeToken(token) {
  if (!token) return null;
  return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
}

export function getAuthToken() {
  return normalizeToken(getSession()?.token || "");
}

export async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
  const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  const { auth = false, headers, timeoutMs: _timeoutMs, ...fetchOptions } = options;
  const token = auth ? getAuthToken() : null;

  try {
    const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { authorization: token } : {}),
        ...(headers || {}),
      },
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw createHttpError(data.message || data.error || "Request failed", response.status, data);
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("Request timed out");
      timeoutError.code = "REQUEST_TIMEOUT";
      throw timeoutError;
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timer);
  }
}
