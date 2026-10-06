import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";
import type { Socket } from "socket.io-client";
import { createGameSocket, getSocketToken } from "../lib/socket";
import type { GameInvitation, SocketAck } from "../types";
import { useAuth } from "./AuthContext";

// Au-delà, on considère que le serveur ne répondra pas
const ACK_TIMEOUT_MS = 8_000;

export const GAME_INVITATIONS_KEY = ["game-invitations"];

// --- Types ---

type MultiplayerStatus = "offline" | "connecting" | "connected";

type MultiplayerContextType = {
  status: MultiplayerStatus;
  /** null tant qu'aucun utilisateur n'est connecté */
  socket: Socket | null;
  /**
   * Envoie un évènement et attend la réponse du serveur. Ne rejette jamais :
   * une coupure ou un timeout reviennent en `{ ok: false, error }`, comme une
   * erreur métier (codes SOCKET_OFFLINE / SOCKET_TIMEOUT, traduits dans errors).
   */
  emit: <T = null>(event: string, payload: object) => Promise<SocketAck<T>>;
};

// --- Context ---

const MultiplayerContext = createContext<MultiplayerContextType | null>(null);

/**
 * Connexion temps réel des parties entre amis. Le socket est ouvert tant qu'un
 * utilisateur est connecté ET que l'app est au premier plan : c'est ce qui
 * permet de recevoir une invitation en direct, quel que soit l'écran.
 */
export function MultiplayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.sub;
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MultiplayerStatus>("offline");

  // Un socket par session utilisateur, recréé si on change de compte. Le créer
  // ne connecte rien (autoConnect: false) : c'est l'effet AppState qui ouvre.
  const socket = useMemo(
    () => (userId ? createGameSocket() : null),
    [userId],
  );

  useEffect(() => {
    if (!socket) return;
    const s = socket;
    // Un seul rafraîchissement forcé par refus du serveur, pour ne pas boucler
    let authRetried = false;

    s.on("connect", () => {
      authRetried = false;
      setStatus("connected");
      // Rattrape les invitations reçues ou annulées pendant une coupure
      queryClient.invalidateQueries({ queryKey: GAME_INVITATIONS_KEY });
    });

    s.on("disconnect", () => {
      // `active` : coupure réseau, socket.io retente seul
      setStatus(s.active ? "connecting" : "offline");
    });

    s.on("connect_error", async (error) => {
      if (s.active) {
        setStatus("connecting");
        return;
      }
      // Refus du serveur (token invalide malgré la vérification d'expiration,
      // ex. secret changé) : socket.io ne retente pas tout seul.
      if (error.message === "unauthorized" && !authRetried) {
        authRetried = true;
        if (await getSocketToken(true)) {
          s.connect();
          return;
        }
      }
      setStatus("offline");
    });

    s.on("invitation:received", (invitation: GameInvitation) => {
      const cached = queryClient.getQueryData<GameInvitation[]>(
        GAME_INVITATIONS_KEY,
      );
      // Pas encore de liste en cache : la remplir avec cette seule invitation
      // masquerait les autres, on laisse le prochain affichage la charger.
      if (!cached) {
        queryClient.invalidateQueries({ queryKey: GAME_INVITATIONS_KEY });
        return;
      }
      queryClient.setQueryData<GameInvitation[]>(GAME_INVITATIONS_KEY, [
        invitation,
        ...cached.filter((i) => i.gameId !== invitation.gameId),
      ]);
    });

    // L'hôte a changé la difficulté : seulement si l'invitation est déjà affichée
    s.on("invitation:updated", (invitation: GameInvitation) => {
      queryClient.setQueryData<GameInvitation[]>(GAME_INVITATIONS_KEY, (list) =>
        list?.map((i) => (i.gameId === invitation.gameId ? invitation : i)),
      );
    });

    s.on("invitation:canceled", ({ gameId }: { gameId: string }) => {
      queryClient.setQueryData<GameInvitation[]>(GAME_INVITATIONS_KEY, (list) =>
        list?.filter((i) => i.gameId !== gameId),
      );
    });

    return () => {
      s.removeAllListeners();
      s.disconnect();
      setStatus("offline");
    };
  }, [socket, queryClient]);

  // Premier plan uniquement : en arrière-plan l'OS coupe de toute façon le
  // réseau, autant fermer proprement et rouvrir au retour.
  useEffect(() => {
    if (!socket) return;

    const sync = (state: AppStateStatus) => {
      if (state === "active" && !socket.connected) {
        socket.connect();
      } else if (state === "background") {
        socket.disconnect();
      }
    };

    sync(AppState.currentState);
    const subscription = AppState.addEventListener("change", sync);
    return () => subscription.remove();
  }, [socket]);

  const emit = useCallback(
    async <T = null,>(event: string, payload: object): Promise<SocketAck<T>> => {
      if (!socket?.connected) return { ok: false, error: "SOCKET_OFFLINE" };
      try {
        return await socket.timeout(ACK_TIMEOUT_MS).emitWithAck(event, payload);
      } catch {
        return { ok: false, error: "SOCKET_TIMEOUT" };
      }
    },
    [socket],
  );

  return (
    <MultiplayerContext.Provider value={{ status, socket, emit }}>
      {children}
    </MultiplayerContext.Provider>
  );
}

export function useMultiplayer() {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error("useMultiplayer must be used within a MultiplayerProvider");
  }
  return context;
}

/**
 * S'abonne à un évènement du serveur le temps de vie du composant. Le handler
 * passe par une ref : il reste à jour sans se réabonner à chaque rendu (même
 * principe que useBlockBackNavigation).
 */
export function useSocketEvent<T>(
  event: string,
  handler: (payload: T) => void,
) {
  const { socket } = useMultiplayer();
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!socket) return;
    const listener = (payload: T) => handlerRef.current(payload);
    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [socket, event]);
}
