import { useAuth } from "@/src/contexts/AuthContext";
import { getActiveGameRequest } from "@/src/services/games/games.api";
import { useQuery } from "@tanstack/react-query";

export const ACTIVE_GAME_KEY = ["active-game"];

/**
 * La partie (salon ou en cours) que le joueur a rejointe, pour lui proposer d'y
 * revenir après avoir quitté l'écran ou tué l'app.
 */
export function useActiveGame() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ACTIVE_GAME_KEY,
    queryFn: getActiveGameRequest,
    enabled: !!user,
  });
}
