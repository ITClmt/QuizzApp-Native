import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";

// Ce composant centralise TOUS les providers de l'app.
// Quand tu ajouteras d'autres providers (ex: ThemeProvider),
// tu les empileras ici au lieu de polluer _layout.tsx.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
