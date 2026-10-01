import { useAlert } from "@/src/contexts/AlertContext";
import { useEffect, useSyncExternalStore } from "react";
import { Platform } from "react-native";

/**
 * `event.code` plutôt que `event.key` pour les chiffres : en AZERTY, la rangée
 * du haut sans Maj donne "&", "é"… alors que le code reste "Digit1".
 */
const ANSWER_CODES = [
  ["Digit1", "Numpad1"],
  ["Digit2", "Numpad2"],
  ["Digit3", "Numpad3"],
  ["Digit4", "Numpad4"],
];

/** Élément qui gère déjà Entrée/Espace lui-même (Pressable actif, champ…). */
const NATIVELY_ACTIVATED = '[tabindex="0"], a[href], input, textarea';

const POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribeToPointer(onChange: () => void) {
  if (Platform.OS !== "web") return () => {};
  const media = window.matchMedia(POINTER_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getPointerSnapshot = () =>
  Platform.OS === "web" && window.matchMedia(POINTER_QUERY).matches;
// Le HTML est pré-rendu sans `window` : côté serveur, et pendant
// l'hydratation, on part de "pas de souris" pour que les deux rendus collent.
const getServerPointerSnapshot = () => false;

interface QuizKeyboardShortcutsParams {
  answerCount: number;
  canAnswer: boolean;
  canGoNext: boolean;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onCancel: () => void;
}

/**
 * Raccourcis clavier du quiz (web uniquement) :
 * - 1-4 : répondre
 * - Entrée / Espace : question suivante
 * - Échap : quitter (avec la confirmation habituelle)
 *
 * Renvoie `showKeyHints` : vrai seulement avec une souris et un clavier
 * probables, pour ne pas afficher des touches à un joueur sur téléphone.
 */
export function useQuizKeyboardShortcuts({
  answerCount,
  canAnswer,
  canGoNext,
  onAnswer,
  onNext,
  onCancel,
}: QuizKeyboardShortcutsParams) {
  const { isAlertOpen } = useAlert();
  const showKeyHints = useSyncExternalStore(
    subscribeToPointer,
    getPointerSnapshot,
    getServerPointerSnapshot,
  );

  useEffect(() => {
    if (Platform.OS !== "web" || isAlertOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      // Touche maintenue : sans ce garde-fou, laisser Entrée enfoncé ferait
      // défiler les questions à la cadence de la répétition clavier.
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        // Le bouton "Question suivante" focalisé se déclenche déjà tout seul :
        // le traiter ici aussi sauterait une question.
        const target = event.target as Element | null;
        if (target?.closest?.(NATIVELY_ACTIVATED)) return;
        if (!canGoNext) return;
        event.preventDefault(); // Espace ferait sinon défiler la page
        onNext();
        return;
      }

      if (!canAnswer) return;
      const answerIndex = ANSWER_CODES.findIndex((codes) =>
        codes.includes(event.code),
      );
      if (answerIndex !== -1 && answerIndex < answerCount) {
        onAnswer(answerIndex);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    isAlertOpen,
    answerCount,
    canAnswer,
    canGoNext,
    onAnswer,
    onNext,
    onCancel,
  ]);

  return { showKeyHints };
}
