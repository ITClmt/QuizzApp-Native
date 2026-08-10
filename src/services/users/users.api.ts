import { apiFetchAuthenticated } from "@/src/lib/api";
import type { UserProfile } from "@/src/types";

export async function getMyProfileRequest() {
  return apiFetchAuthenticated<UserProfile>("/users/me");
}

export function updateUserRequest(userId: string, data: { lang: string }) {
  return apiFetchAuthenticated<void>(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
