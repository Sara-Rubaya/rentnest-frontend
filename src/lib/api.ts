/**
 * Thin fetch wrapper around the RentNest backend API.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local to your deployed backend.
 * All calls attach the JWT stored by the auth context (if present).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Token lives in a cookie (not localStorage) so that middleware.ts can read it
// server-side when deciding whether to allow access to a protected route.
const TOKEN_COOKIE = "rentnest_token";
const ROLE_COOKIE = "rentnest_role";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

interface Envelope<T> {
  success: boolean;
  message: string;
  meta?: { page?: number; limit?: number; total?: number };
  data: T;
}

// The backend (sendResponse.ts) wraps every response as { success, message, meta, data }
// and every error as { success: false, message, errorDetails }. `api()` unwraps `data`
// for you; use `apiWithMeta()` when you also need pagination info (e.g. GET /properties).
export async function apiWithMeta<T>(
  path: string,
  options: ApiOptions = {}
): Promise<{ data: T; meta?: Envelope<T>["meta"] }> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : { success: res.ok, message: "", data: undefined };

  if (!res.ok || json.success === false) {
    throw new Error(json?.message || `Request failed: ${res.status}`);
  }

  return { data: json.data as T, meta: json.meta };
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { data } = await apiWithMeta<T>(path, options);
  return data;
}

export function setSession(token: string, role: string) {
  if (typeof window === "undefined") return;
  // 7 day session; adjust maxAge to match your backend's JWT expiry.
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}`;
  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(role)}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0`;
}

export function getStoredToken() {
  return getToken();
}
