import { Colors } from "@/constants/theme";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { Providers } from "@/src/components/Providers";
import { useDocumentTitle } from "@/src/hooks/useDocumentTitle";
import { initI18n } from "@/src/i18n";
import {
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from "@expo-google-fonts/baloo-2";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

/** Doit vivre sous <Providers> : il a besoin de l'i18n. */
function DocumentTitle() {
  useDocumentTitle();
  return null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n().finally(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if ((loaded || error) && i18nReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, i18nReady]);

  if ((!loaded && !error) || !i18nReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Providers>
        <DocumentTitle />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors.background,
            },
          }}
        >
          {/* Swipe retour depuis n'importe où sur l'écran (iOS), pas seulement le bord */}
          <Stack.Screen
            name="friends"
            options={{ gestureEnabled: true, fullScreenGestureEnabled: true }}
          />
        </Stack>
      </Providers>
    </ErrorBoundary>
  );
}
