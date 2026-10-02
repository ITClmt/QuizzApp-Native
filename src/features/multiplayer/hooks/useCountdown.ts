import { useEffect, useState } from "react";

const TICK_MS = 250;

/**
 * Secondes restantes avant `deadline` (heure locale), plafonnées à `maxSeconds`.
 * Rafraîchi 4 fois par seconde pour que le passage d'une seconde à l'autre
 * tombe au bon moment, quel que soit l'instant de réception de la question.
 */
export function useCountdown(deadline: number | null, maxSeconds: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (deadline === null) return;
    const interval = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(interval);
  }, [deadline]);

  if (deadline === null) return 0;
  // `now` peut dater de la question précédente juste après en avoir reçu une
  // nouvelle : le plafond évite d'afficher 11 ou 12 s pendant un quart de seconde.
  const remaining = Math.ceil((deadline - now) / 1000);
  return Math.max(0, Math.min(maxSeconds, remaining));
}
