import { useEffect, useState } from "react";
import { useReducedMotion } from "react-native-reanimated";

/** Décélération : le compteur ralentit en approchant du résultat. */
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Fait défiler un nombre de 0 jusqu'à `target`. Avec "réduire les
 * animations", la valeur finale est affichée tout de suite.
 */
export function useCountUp(target: number, durationMs = 600) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let frame: number;
    let start: number | undefined;

    const step = (now: number) => {
      start ??= now;
      const progress = Math.min(1, Math.max(0, (now - start) / durationMs));
      setValue(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, reduceMotion]);

  return reduceMotion ? target : value;
}
