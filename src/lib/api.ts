import { Storage } from "./storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) throw new Error("EXPO_PUBLIC_API_URL is not configured in .env");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data.message ?? "Unknown error");
  return data;
}

// Un seul refresh en vol à la fois — les 401 concurrents partagent la même promesse
let refreshPromise: Promise<string | null> | null = null;

async function refreshTokens(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  return (refreshPromise = (async () => {
    try {
      const refreshToken = await Storage.getItemAsync("refresh_token");
      if (!refreshToken) return null;

      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;

      const { access_token, refresh_token } = await res.json();
      await Storage.setItemAsync("access_token", access_token);
      await Storage.setItemAsync("refresh_token", refresh_token);
      return access_token as string;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })());
}

export async function apiFetchAuthenticated<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = await Storage.getItemAsync("access_token");
  const withBearer = (token: string | null): RequestInit => ({
    ...options,
    headers: { Authorization: `Bearer ${token ?? ""}`, ...options.headers },
  });

  try {
    return await apiFetch<T>(endpoint, withBearer(accessToken));
  } catch (err) {
    if (!(err instanceof ApiError && err.status === 401)) throw err;

    const newToken = await refreshTokens();
    if (!newToken) throw err;
    return apiFetch<T>(endpoint, withBearer(newToken));
  }
}
