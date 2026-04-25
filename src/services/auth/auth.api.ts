import { apiFetch } from "@/src/lib/api";
import * as SecureStore from "expo-secure-store";

// --- Endpoints ---

export function loginRequest(email: string, password: string) {
  return apiFetch<AuthTokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerRequest(
  email: string,
  password: string,
  username: string,
) {
  return apiFetch<AuthTokens>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });
}

export function refreshTokensRequest(refreshToken: string) {
  return apiFetch<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutRequest() {
  const refreshToken = await SecureStore.getItemAsync("refresh_token");
  if (!refreshToken) return;

  return apiFetch<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
