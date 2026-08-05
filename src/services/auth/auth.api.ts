import { apiFetch, apiFetchAuthenticated } from "@/src/lib/api";
import { Storage } from "@/src/lib/storage";
import type { AuthTokens, UserProfile } from "@/src/types";

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
  lang: string = "en",
) {
  return apiFetch<AuthTokens>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username, lang }),
  });
}

export function refreshTokensRequest(refreshToken: string) {
  return apiFetch<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getProfileRequest() {
  return apiFetchAuthenticated<UserProfile>("/auth/profile");
}

export async function logoutRequest() {
  const refreshToken = await Storage.getItemAsync("refresh_token");
  if (!refreshToken) return;

  return apiFetch<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
