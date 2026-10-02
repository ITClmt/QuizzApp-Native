import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * Second mode de jeu de l'accueil. Carte blanche : le violet plein reste réservé
 * à l'action principale de l'écran (le solo).
 */
export function PlayWithFriendsBtn() {
  const router = useRouter();
  const { isOnline } = useNetworkStatus();
  const { t } = useTranslation("multiplayer");

  return (
    <Pressable
      onPress={() => router.push("/create")}
      disabled={!isOnline}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isOnline }}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        !isOnline && styles.disabled,
      ]}
    >
      <View style={styles.icon}>
        <MaterialIcons name="groups" size={28} color={Colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{t("home.playWithFriends")}</Text>
        <Text style={styles.subtitle}>{t("home.playWithFriendsSubtitle")}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.titleLg,
    color: Colors.onSurface,
  },
  subtitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
});
