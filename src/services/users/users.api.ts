import { apiFetchAuthenticated } from "@/src/lib/api";

export function updateUserRequest(userId: string, data: { lang: string }) {
  return apiFetchAuthenticated<void>(`/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
