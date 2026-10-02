import { apiFetchAuthenticated } from "@/src/lib/api";
import type { ActiveGame, GameDifficulty, GameInvitation } from "@/src/types";

/** Sans difficulté = partie mixte */
export function createGameRequest(
  friendIds: string[],
  difficulty: GameDifficulty | null,
) {
  return apiFetchAuthenticated<{ gameId: string }>("/games", {
    method: "POST",
    body: JSON.stringify({ friendIds, ...(difficulty && { difficulty }) }),
  });
}

export function getGameInvitationsRequest() {
  return apiFetchAuthenticated<GameInvitation[]>("/games/invitations");
}

export function declineGameInvitationRequest(gameId: string) {
  return apiFetchAuthenticated<void>(`/games/${gameId}/decline`, {
    method: "POST",
  });
}

/** La partie (salon ou en cours) à laquelle revenir */
export function getActiveGameRequest() {
  return apiFetchAuthenticated<ActiveGame>("/games/active");
}
