import { apiFetchAuthenticated } from "@/src/lib/api";
import type { AvatarCatalogEntry, UserProfile } from "@/src/types";

export async function getMyProfileRequest() {
  return apiFetchAuthenticated<UserProfile>("/users/me");
}

export function updateUserRequest(
  userId: string,
  data: { lang?: string; avatarSlug?: string },
) {
  return apiFetchAuthenticated<void>(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getAvatarsRequest() {
  return apiFetchAuthenticated<AvatarCatalogEntry[]>("/users/avatars");
}

/** Renvoie une nouvelle paire de tokens : les autres appareils sont déconnectés */
export function changePasswordRequest(
  currentPassword: string,
  newPassword: string,
) {
  return apiFetchAuthenticated<{ access_token: string; refresh_token: string }>(
    "/users/me/password",
    {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    },
  );
}

export function deleteAccountRequest(password: string) {
  return apiFetchAuthenticated<void>("/users/me", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}
