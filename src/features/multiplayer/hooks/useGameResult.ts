import type { GameDifficulty, GameEnd } from "@/src/types";
import { useQuery, type QueryClient } from "@tanstack/react-query";

export interface GameResultData {
  end: GameEnd;
  /** Pour relancer une revanche à l'identique */
  difficulty: GameDifficulty | null;
}

const gameResultKey = (gameId: string) => ["game-result", gameId];

/** Même principe que storeQuizResult : les résultats passent par le cache */
export function storeGameResult(
  queryClient: QueryClient,
  gameId: string,
  data: GameResultData,
) {
  queryClient.setQueryData(gameResultKey(gameId), data);
}

/**
 * Lit le résultat rangé par `storeGameResult`, sans jamais appeler le réseau.
 * `undefined` si le cache est vide (page web rechargée) : il n'existe pas encore
 * de route pour relire une partie multijoueur, l'écran renvoie alors à l'accueil.
 */
export function useGameResult(gameId: string | undefined) {
  const { data } = useQuery<GameResultData>({
    queryKey: gameResultKey(gameId ?? ""),
    queryFn: () => {
      throw new Error("Game result is only ever written by storeGameResult");
    },
    enabled: false,
    staleTime: Infinity,
  });

  return gameId ? data : undefined;
}
