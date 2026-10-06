import {
  GAME_INVITATIONS_KEY,
  useMultiplayer,
  useSocketEvent,
} from "@/src/contexts/MultiplayerContext";
import type { GameDifficulty, GameInvitation, Lobby } from "@/src/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { ACTIVE_GAME_KEY } from "./useActiveGame";
import { useJoinGame } from "./useJoinGame";

/**
 * État d'un salon, tenu à jour en direct. Entrer dans le salon (game:join) vaut
 * acceptation de l'invitation.
 */
export function useLobby(gameId: string) {
  const { emit } = useMultiplayer();
  const queryClient = useQueryClient();
  const [lobby, setLobby] = useState<Lobby | null>(null);

  const { joinError, canceledReason, leave: leaveGame } = useJoinGame<Lobby>(
    gameId,
    (joined) => {
      setLobby(joined);
      // Invitation acceptée : elle n'a plus à s'afficher nulle part
      queryClient.setQueryData<GameInvitation[]>(GAME_INVITATIONS_KEY, (list) =>
        list?.filter((i) => i.gameId !== gameId),
      );
      queryClient.invalidateQueries({ queryKey: ACTIVE_GAME_KEY });
    },
  );

  useSocketEvent<Lobby>("lobby:update", (update) => {
    if (update.gameId === gameId) setLobby(update);
  });

  const leave = useCallback(() => {
    leaveGame().finally(() => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_GAME_KEY });
      // Un invité parti avant le lancement retrouve l'invitation pour revenir
      queryClient.invalidateQueries({ queryKey: GAME_INVITATIONS_KEY });
    });
  }, [leaveGame, queryClient]);

  /** Hôte uniquement. Le passage à l'écran de partie suit le lobby:update. */
  const start = useCallback(
    () => emit("game:start", { gameId }),
    [emit, gameId],
  );

  /** Invités uniquement. L'affichage suit le lobby:update. */
  const setReady = useCallback(
    (ready: boolean) => emit("game:ready", { gameId, ready }),
    [emit, gameId],
  );

  /** Hôte uniquement. null = mixte. */
  const setDifficulty = useCallback(
    (difficulty: GameDifficulty | null) =>
      emit("game:difficulty", { gameId, difficulty }),
    [emit, gameId],
  );

  return {
    lobby,
    joinError,
    canceledReason,
    leave,
    start,
    setReady,
    setDifficulty,
  };
}
