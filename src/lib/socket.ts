import { jwtDecode } from "jwt-decode";
import { io, type Socket } from "socket.io-client";
import { refreshTokens } from "./api";
import { Storage } from "./storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL as string;

// Le serveur socket.io écoute sur la même origine que l'API, sous /api/socket.io.
// On retire le /api final à la main : `URL` n'est que partiellement implémenté
// dans React Native (pas de `.origin` fiable).
const SOCKET_ORIGIN = API_URL.replace(/\/api\/?$/, "");

// Un token qui expire dans moins de 30 s est traité comme expiré : la poignée de
// main ne doit pas échouer à la seconde près.
const EXPIRY_MARGIN_MS = 30_000;

function isExpiringSoon(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000 - EXPIRY_MARGIN_MS;
  } catch {
    return true;
  }
}

/**
 * Token à présenter au serveur : celui stocké s'il est encore valable, sinon un
 * token rafraîchi (même refresh partagé que les requêtes HTTP). `null` si la
 * session ne peut plus être rafraîchie.
 */
export async function getSocketToken(forceRefresh = false) {
  const token = await Storage.getItemAsync("access_token");
  if (token && !forceRefresh && !isExpiringSoon(token)) return token;
  return refreshTokens();
}

/**
 * Socket des parties multijoueur, non connecté : c'est MultiplayerContext qui
 * décide quand se connecter (utilisateur connecté + app au premier plan).
 */
export function createGameSocket(): Socket {
  return io(SOCKET_ORIGIN, {
    path: "/api/socket.io",
    transports: ["websocket"],
    autoConnect: false,
    // Fonction rappelée à chaque tentative de (re)connexion : on ne présente
    // jamais un token périmé, même après des heures en arrière-plan.
    auth: (cb) => {
      getSocketToken().then((token) => cb({ token: token ?? "" }));
    },
  });
}
