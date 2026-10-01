import { Radius, Spacing } from "@/constants/theme";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

const PHONE_WIDTH = 440;
const PHONE_MAX_HEIGHT = 940;
/** En dessous, on ne rogne pas la hauteur : chaque pixel compte. */
const MIN_HEIGHT_FOR_MARGIN = 780;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const isFramed = Platform.OS === "web" && width > PHONE_WIDTH;
  const hasVerticalRoom = isFramed && height > MIN_HEIGHT_FOR_MARGIN;

  return (
    <View
      style={[
        styles.root,
        isFramed && styles.rootFramed,
        hasVerticalRoom && styles.rootPadded,
      ]}
    >
      <View
        style={[
          styles.frame,
          isFramed && styles.frameSized,
          hasVerticalRoom && styles.frameRounded,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootFramed: {
    alignItems: "center",
    justifyContent: "center",
  },
  rootPadded: {
    paddingVertical: Spacing.xl,
  },
  frame: {
    flex: 1,
    width: "100%",
    // Coupe ce qui dépasse plutôt que de laisser le navigateur ajouter du scroll.
    overflow: "hidden",
  },
  frameSized: {
    maxWidth: PHONE_WIDTH,
    maxHeight: PHONE_MAX_HEIGHT,
    // Large et diffuse : décolle le cadre du fond au lieu de le poser à plat.
    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5)",
  },
  frameRounded: {
    borderRadius: Radius["2xl"],
  },
});
