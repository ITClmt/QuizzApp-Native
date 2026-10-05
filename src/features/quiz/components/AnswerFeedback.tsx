import { useEffect, type ReactNode } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type AnswerFeedbackState = "correct" | "wrong" | null;

/** Démarre vite : le retour arrive au moment où l'œil est sur la réponse. */
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

interface AnswerFeedbackProps {
  state: AnswerFeedbackState;
  children: ReactNode;
}

/**
 * Anime une réponse au moment de la correction : petit rebond pour la bonne,
 * secousse pour la mauvaise choisie. Sur natif les vibrations (Haptics) jouent
 * déjà ce rôle, mais le web n'en a pas : sans ça, seul le changement de
 * couleur signalait le résultat.
 */
export function AnswerFeedback({ state, children }: AnswerFeedbackProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Mouvement réduit : les couleurs et icônes ✓/✗ suffisent à l'information.
    if (reduceMotion) return;

    if (state === "correct") {
      // Aller-retour net (~200 ms) : un ressort oscillait trop longtemps.
      scale.set(
        withSequence(
          withTiming(1.04, { duration: 90, easing: EASE_OUT }),
          withTiming(1, { duration: 110, easing: EASE_OUT }),
        ),
      );
    } else if (state === "wrong") {
      translateX.set(
        withSequence(
          withTiming(-8, { duration: 50, easing: EASE_OUT }),
          withTiming(8, { duration: 50, easing: EASE_OUT }),
          withTiming(-6, { duration: 50, easing: EASE_OUT }),
          withTiming(6, { duration: 50, easing: EASE_OUT }),
          withTiming(0, { duration: 50, easing: EASE_OUT }),
        ),
      );
    }
  }, [state, reduceMotion, scale, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.get() }, { scale: scale.get() }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
