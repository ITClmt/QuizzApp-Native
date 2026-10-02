import { useAlert } from "@/src/contexts/AlertContext";
import { ApiError, getErrorMessage } from "@/src/lib/api";
import { createGameRequest } from "@/src/services/games/games.api";
import type { GameDifficulty } from "@/src/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ACTIVE_GAME_KEY } from "./useActiveGame";

type CreateGameInput = {
  friendIds: string[];
  difficulty: GameDifficulty | null;
};

/** Crée la partie puis ouvre son salon (l'hôte y est déjà JOINED) */
export function useCreateGame() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { t } = useTranslation(["multiplayer", "common"]);

  return useMutation({
    mutationFn: ({ friendIds, difficulty }: CreateGameInput) =>
      createGameRequest(friendIds, difficulty),
    onSuccess: ({ gameId }) => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_GAME_KEY });
      router.replace({ pathname: "/lobby/[gameId]", params: { gameId } });
    },
    onError: (error) => {
      showAlert(
        t("common:errors.title"),
        error instanceof ApiError
          ? getErrorMessage(error)
          : t("create.createError"),
      );
    },
  });
}
