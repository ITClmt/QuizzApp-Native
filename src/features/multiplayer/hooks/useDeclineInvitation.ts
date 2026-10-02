import { useAlert } from "@/src/contexts/AlertContext";
import { GAME_INVITATIONS_KEY } from "@/src/contexts/MultiplayerContext";
import { ApiError, getErrorMessage } from "@/src/lib/api";
import { declineGameInvitationRequest } from "@/src/services/games/games.api";
import type { GameInvitation } from "@/src/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

/** Refuser une invitation : elle disparaît tout de suite de la liste */
export function useDeclineInvitation() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { t } = useTranslation("common");

  return useMutation({
    mutationFn: declineGameInvitationRequest,
    onSuccess: (_, gameId) => {
      queryClient.setQueryData<GameInvitation[]>(GAME_INVITATIONS_KEY, (list) =>
        list?.filter((i) => i.gameId !== gameId),
      );
    },
    onError: (error) => {
      showAlert(
        t("errors.title"),
        error instanceof ApiError
          ? getErrorMessage(error)
          : t("errors.networkMessage"),
      );
      // L'invitation a pu expirer entre-temps : on recharge la vraie liste
      queryClient.invalidateQueries({ queryKey: GAME_INVITATIONS_KEY });
    },
  });
}
