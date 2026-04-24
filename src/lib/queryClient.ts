import { QueryClient } from "@tanstack/react-query";

// On crée l'instance UNE seule fois, en dehors de tout composant.
// Ça évite de recréer le cache à chaque re-render.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Pas de refetch auto quand la fenêtre reprend le focus
      // (comportement par défaut pensé pour le web, inutile en mobile)
      refetchOnWindowFocus: false,

      // Nombre de tentatives en cas d'échec réseau
      retry: 2,

      // Les données sont considérées "fraîches" pendant 30 secondes
      // Pendant ce temps, React Query sert le cache sans refetch
      staleTime: 1000 * 30,
    },
  },
});
