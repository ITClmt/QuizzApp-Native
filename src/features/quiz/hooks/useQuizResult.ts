import type { QuizQuestion, QuizResult } from "@/src/types";
import { useQuery, type QueryClient } from "@tanstack/react-query";

export interface QuizResultData {
  result: QuizResult;
  questions: QuizQuestion[];
  userAnswers: number[];
}

const quizResultKey = (sessionId: string) => ["quiz-result", sessionId];

/**
 * Passe le résultat du quiz à l'écran de résultats par le cache React Query
 * plutôt que par l'URL.
 */
export function storeQuizResult(
  queryClient: QueryClient,
  sessionId: string,
  data: QuizResultData,
) {
  queryClient.setQueryData(quizResultKey(sessionId), data);
}

/**
 * Lit le résultat rangé par `storeQuizResult`. Jamais de requête réseau : le
 * cache est la seule source. `undefined` quand il est vide (page rechargée,
 * lien ouvert ailleurs) : l'écran doit alors se rabattre sur l'historique.
 *
 * Passer par useQuery (et pas getQueryData) abonne l'écran à l'entrée : tant
 * qu'il est affiché, React Query ne la supprime pas du cache.
 */
export function useQuizResult(sessionId: string | undefined) {
  const { data } = useQuery<QuizResultData>({
    queryKey: quizResultKey(sessionId ?? ""),
    queryFn: () => {
      throw new Error("Quiz result is only ever written by storeQuizResult");
    },
    enabled: false,
    staleTime: Infinity,
  });

  return sessionId ? data : undefined;
}
