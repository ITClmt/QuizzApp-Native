import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlertProvider } from "../contexts/AlertContext";
import { AuthProvider } from "../contexts/AuthContext";
import { MultiplayerProvider } from "../contexts/MultiplayerContext";
import { i18n } from "../i18n";
import { queryClient } from "../lib/queryClient";
import { AppShell } from "./AppShell";
import { OfflineBanner } from "./OfflineBanner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MultiplayerProvider>
              <AppShell>
                <AlertProvider>
                  {children}
                  <OfflineBanner />
                </AlertProvider>
              </AppShell>
            </MultiplayerProvider>
          </AuthProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
