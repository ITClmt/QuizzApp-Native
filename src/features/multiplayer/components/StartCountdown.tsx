import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

/**
 * 3, 2, 1 avant la 1re question : tout le monde part en même temps, l'hôte
 * compris. Chaque chiffre apparaît en fondu court.
 */
export function StartCountdown({ secondsLeft }: { secondsLeft: number }) {
  const { t } = useTranslation("multiplayer");

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text style={styles.title}>{t("game.countdown")}</Text>
      <Animated.Text
        key={secondsLeft}
        entering={FadeIn.duration(200)}
        style={styles.value}
      >
        {secondsLeft > 0 ? secondsLeft : t("game.go")}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.titleLg,
    color: Colors.onSurfaceVariant,
  },
  value: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.displayLg,
    color: Colors.primary,
  },
});
