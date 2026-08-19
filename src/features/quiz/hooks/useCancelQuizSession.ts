import { useAlert } from "@/src/contexts/AlertContext";
import { ApiError, getErrorMessage } from "@/src/lib/api";
import { cancelQuizSession } from "@/src/services/quiz/quiz.api";
import type { QuizSession } from "@/src/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Sortie unique d'un quiz en cours : confirmation puis annulation serveur.
 *
 * Le bouton d'abandon ET le retour système (bouton/geste Android, swipe iOS)
 * passent tous les deux par ici, pour qu'aucun des deux ne soit un cul-de-sac
 * et qu'ils ne puissent pas empiler deux modales concurrentes.
 */
export function useCancelQuizSession(sessionId: string | undefined) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { t } = useTranslation(["quiz", "common"]);
  const isConfirmOpenRef = useRef(false);

  const { mutate, isPending } = useMutation<QuizSession, ApiError, string>({
    mutationFn: (id) => cancelQuizSession(id),

    onSuccess: () => {
      router.replace("/(app)");
    },

    onError: (err) => {
      showAlert(
        t("common:errors.title"),
        t("session.cancelError", { message: getErrorMessage(err) }),
      );
    },
  });

  const confirmCancel = useCallback(() => {
    // Session pas encore créée côté serveur : rien à annuler, on sort direct
    // plutôt que de bloquer l'utilisateur sur un écran de chargement.
    if (!sessionId) {
      router.replace("/(app)");
      return;
    }

    if (isPending || isConfirmOpenRef.current) return;
    isConfirmOpenRef.current = true;

    showAlert(
      t("session.cancelConfirmTitle"),
      t("session.cancelConfirmMessage"),
      [
        {
          text: t("session.keepPlaying"),
          style: "cancel", // Sur iOS : met ce bouton en gras (action "safe")
          onPress: () => {
            isConfirmOpenRef.current = false;
          },
        },
        {
          text: t("session.quit"),
          style: "destructive", // Sur iOS : affiche en rouge pour signaler le danger
          onPress: () => {
            isConfirmOpenRef.current = false;
            mutate(sessionId);
          },
        },
      ],
      // Android : sans ça, un tap hors modale la ferme sans repasser par un
      // onPress, et le garde-fou resterait bloqué à "ouvert".
      { cancelable: false },
    );
  }, [sessionId, isPending, mutate, router, showAlert, t]);

  return { confirmCancel, isPending };
}
