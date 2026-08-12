import { onlineManager } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * État réseau de l'appli.
 *
 * On s'abonne au onlineManager de React Query plutôt qu'à NetInfo directement :
 * queryClient.ts y branche déjà NetInfo, donc un second écouteur ferait doublon
 * et pourrait diverger. Une seule source de vérité pour "en ligne".
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => onlineManager.isOnline());

  useEffect(() => onlineManager.subscribe(setIsOnline), []);

  return { isOnline };
}
