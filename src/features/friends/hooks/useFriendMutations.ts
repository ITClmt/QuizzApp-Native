import { useAlert } from "@/src/contexts/AlertContext";
import { ApiError, getErrorMessage } from "@/src/lib/api";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  removeFriendRequest,
  sendFriendRequest,
} from "@/src/services/friends/friends.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

/**
 * Toutes les actions sur les amis. Pas de mise à jour optimiste : après chaque
 * action on recharge les listes concernées, y compris ["profile"] qui porte le
 * compteur de la pastille.
 */
export function useFriendMutations() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { t } = useTranslation(["friends", "common"]);

  const onSettled = () =>
    Promise.all(
      ["friends", "friend-requests", "friend-search", "profile"].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    );

  const onError = (error: Error) => {
    showAlert(
      t("common:errors.title"),
      error instanceof ApiError ? getErrorMessage(error) : t("actionError"),
    );
  };

  const send = useMutation({ mutationFn: sendFriendRequest, onError, onSettled });
  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onError,
    onSettled,
  });
  const deleteRequest = useMutation({
    mutationFn: deleteFriendRequest,
    onError,
    onSettled,
  });
  const remove = useMutation({
    mutationFn: removeFriendRequest,
    onError,
    onSettled,
  });

  return {
    send,
    accept,
    deleteRequest,
    remove,
    isPending:
      send.isPending ||
      accept.isPending ||
      deleteRequest.isPending ||
      remove.isPending,
  };
}
