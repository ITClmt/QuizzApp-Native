import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { i18n } from "../i18n";
import { AuthProvider } from "../contexts/AuthContext";
import { queryClient } from "../lib/queryClient";
import { OfflineBanner } from "./OfflineBanner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <OfflineBanner />
        </AuthProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
