import { useAlert } from "@/src/contexts/AlertContext";
import type { GameCancelReason } from "@/src/types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSocketErrorMessage } from "../utils/socketErrorMessage";

/**
 * Sorties imposées d'une partie, communes au salon et à l'écran de jeu : partie
 * introuvable, invitation expirée, déjà en partie… ou partie annulée. On prévient
 * puis on renvoie à l'accueil.
 */
export function useGameExitAlerts({
  joinError,
  canceledReason,
  onExit,
}: {
  joinError: string | null;
  canceledReason: GameCancelReason | null;
  onExit: () => void;
}) {
  const { showAlert } = useAlert();
  const { t } = useTranslation(["multiplayer", "common"]);

  useEffect(() => {
    if (!joinError) return;
    showAlert(
      t("common:errors.title"),
      getSocketErrorMessage(joinError),
      [{ text: t("common:ok"), onPress: onExit }],
      { cancelable: false },
    );
  }, [joinError, showAlert, onExit, t]);

  useEffect(() => {
    if (!canceledReason) return;
    showAlert(
      t("canceled.title"),
      t(`canceled.${canceledReason}`),
      [{ text: t("common:ok"), onPress: onExit }],
      { cancelable: false },
    );
  }, [canceledReason, showAlert, onExit, t]);
}
