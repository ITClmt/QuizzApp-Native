import {
  GAME_INVITATIONS_KEY,
  useMultiplayer,
  useSocketEvent,
} from "@/src/contexts/MultiplayerContext";
import type { GameCancelReason, GameInvitation, Lobby } from "@/src/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACTIVE_GAME_KEY } from "./useActiveGame";

/**
 * État d'un salon, tenu à jour en direct.
 *
 * Entrer dans le salon (game:join) vaut acceptation de l'invitation. On le
 * renvoie à chaque (re)connexion du socket : après une coupure, le serveur ne
 * sait plus que ce socket est dans la partie.
 */
export function useLobby(gameId: string) {
  const { status, emit } = useMultiplayer();
  const queryClient = useQueryClient();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [canceledReason, setCanceledReason] =
    useState<GameCancelReason | null>(null);
  // L'hôte qui part reçoit lui aussi game:canceled : ce n'est pas une surprise
  const leavingRef = useRef(false);

  useEffect(() => {
    if (status !== "connected") return;
    let active = true;

    emit<Lobby>("game:join", { gameId }).then((ack) => {
      if (!active) return;
      if (!ack.ok) {
        setJoinError(ack.error);
        return;
      }
      setLobby(ack.data);
      // Invitation acceptée : elle n'a plus à s'afficher nulle part
      queryClient.setQueryData<GameInvitation[]>(GAME_INVITATIONS_KEY, (list) =>
        list?.filter((i) => i.gameId !== gameId),
      );
      queryClient.invalidateQueries({ queryKey: ACTIVE_GAME_KEY });
    });

    return () => {
      active = false;
    };
  }, [status, gameId, emit, queryClient]);

  useSocketEvent<Lobby>("lobby:update", (update) => {
    if (update.gameId === gameId) setLobby(update);
  });

  useSocketEvent<{ gameId: string; reason: GameCancelReason }>(
    "game:canceled",
    (event) => {
      if (event.gameId === gameId && !leavingRef.current) {
        setCanceledReason(event.reason);
      }
    },
  );

  /** Quitter le salon. L'écran navigue tout de suite, sans attendre le serveur. */
  const leave = useCallback(() => {
    leavingRef.current = true;
    emit("game:leave", { gameId }).finally(() => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_GAME_KEY });
      // Un invité parti avant le lancement retrouve l'invitation pour revenir
      queryClient.invalidateQueries({ queryKey: GAME_INVITATIONS_KEY });
    });
  }, [emit, gameId, queryClient]);

  /** Hôte uniquement. Le passage à l'écran de partie suit le lobby:update. */
  const start = useCallback(
    () => emit("game:start", { gameId }),
    [emit, gameId],
  );

  return { lobby, joinError, canceledReason, leave, start };
}
