import {
  useMultiplayer,
  useSocketEvent,
} from "@/src/contexts/MultiplayerContext";
import type { GameCancelReason } from "@/src/types";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Être dans une partie (salon ou en cours), commun au salon et à l'écran de jeu.
 *
 * On (re)rejoint à chaque connexion du socket : après une coupure, le serveur ne
 * sait plus que ce socket est dans la partie. `onJoined` reçoit la réponse, qui
 * sert autant au premier affichage qu'à une reprise. Le handler passe par une
 * ref : il reste à jour sans relancer de join à chaque rendu.
 */
export function useJoinGame<T>(gameId: string, onJoined: (data: T) => void) {
  const { status, emit } = useMultiplayer();
  const [joinError, setJoinError] = useState<string | null>(null);
  const [canceledReason, setCanceledReason] =
    useState<GameCancelReason | null>(null);
  // Celui qui part peut lui aussi recevoir game:canceled (l'hôte qui quitte le
  // salon l'annule) : ce n'est pas une surprise à lui annoncer
  const leavingRef = useRef(false);
  const onJoinedRef = useRef(onJoined);
  useEffect(() => {
    onJoinedRef.current = onJoined;
  });

  useEffect(() => {
    if (status !== "connected") return;
    let active = true;

    emit<T>("game:join", { gameId }).then((ack) => {
      if (!active) return;
      if (ack.ok) onJoinedRef.current(ack.data);
      else setJoinError(ack.error);
    });

    return () => {
      active = false;
    };
  }, [status, gameId, emit]);

  useSocketEvent<{ gameId: string; reason: GameCancelReason }>(
    "game:canceled",
    (event) => {
      if (event.gameId === gameId && !leavingRef.current) {
        setCanceledReason(event.reason);
      }
    },
  );

  /** Quitter la partie. L'écran navigue tout de suite, sans attendre le serveur. */
  const leave = useCallback(() => {
    leavingRef.current = true;
    return emit("game:leave", { gameId });
  }, [emit, gameId]);

  return { joinError, canceledReason, leave };
}
