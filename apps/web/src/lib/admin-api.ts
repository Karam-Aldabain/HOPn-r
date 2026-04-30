const RAW_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const ADMIN_API_BASE = RAW_BASE.replace(/\/$/, "").endsWith("/api")
  ? RAW_BASE.replace(/\/$/, "")
  : `${RAW_BASE.replace(/\/$/, "")}/api`;

const ACCESS_KEY = "hopn_admin_token";
const REFRESH_KEY = "hopn_admin_refresh";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getAdminRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setAdminToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) localStorage.removeItem(ACCESS_KEY);
  else localStorage.setItem(ACCESS_KEY, token);
}

export function setAdminRefreshToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) localStorage.removeItem(REFRESH_KEY);
  else localStorage.setItem(REFRESH_KEY, token);
}

async function refreshAccessToken() {
  const refreshToken = getAdminRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${ADMIN_API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { accessToken: string; refreshToken?: string };
  if (data.accessToken) setAdminToken(data.accessToken);
  if (data.refreshToken) setAdminRefreshToken(data.refreshToken);
  return data.accessToken;
}

export async function adminLogout() {
  const refreshToken = getAdminRefreshToken();
  try {
    if (refreshToken) {
      await fetch(`${ADMIN_API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    setAdminToken(null);
    setAdminRefreshToken(null);
  }
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
  retry = true,
): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${ADMIN_API_BASE}${path.startsWith("/") ? "" : "/"}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    if (res.status === 401 && retry && !path.startsWith("/auth/")) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return adminFetch<T>(path, init, false);
      }
    }
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  if (res.status === 204) return null as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
