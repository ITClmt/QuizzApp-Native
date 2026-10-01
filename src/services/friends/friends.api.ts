import { apiFetchAuthenticated } from "@/src/lib/api";
import type {
  Friend,
  FriendRequests,
  FriendSearchResult,
} from "@/src/types";

export function getFriendsRequest() {
  return apiFetchAuthenticated<Friend[]>("/friends");
}

export function getFriendRequestsRequest() {
  return apiFetchAuthenticated<FriendRequests>("/friends/requests");
}

export function searchUsersRequest(q: string) {
  return apiFetchAuthenticated<FriendSearchResult[]>(
    `/friends/search?q=${encodeURIComponent(q)}`,
  );
}

export function sendFriendRequest(userId: string) {
  return apiFetchAuthenticated<{ id: string; status: "PENDING" | "ACCEPTED" }>(
    "/friends/requests",
    { method: "POST", body: JSON.stringify({ userId }) },
  );
}

export function acceptFriendRequest(requestId: string) {
  return apiFetchAuthenticated<{ id: string; status: "ACCEPTED" }>(
    `/friends/requests/${requestId}/accept`,
    { method: "POST" },
  );
}

/** Refus (destinataire) ou annulation (émetteur) */
export function deleteFriendRequest(requestId: string) {
  return apiFetchAuthenticated<void>(`/friends/requests/${requestId}`, {
    method: "DELETE",
  });
}

export function removeFriendRequest(userId: string) {
  return apiFetchAuthenticated<void>(`/friends/${userId}`, {
    method: "DELETE",
  });
}
