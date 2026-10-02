import { useAuth } from "@/src/contexts/AuthContext";
import { GAME_INVITATIONS_KEY } from "@/src/contexts/MultiplayerContext";
import { getGameInvitationsRequest } from "@/src/services/games/games.api";
import { useQuery } from "@tanstack/react-query";

/**
 * Invitations reçues encore valables. Chargées en REST, puis tenues à jour en
 * direct par MultiplayerContext (invitation:received / invitation:canceled) et
 * rechargées à chaque reconnexion du socket.
 */
export function useGameInvitations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: GAME_INVITATIONS_KEY,
    queryFn: getGameInvitationsRequest,
    enabled: !!user,
  });
}
