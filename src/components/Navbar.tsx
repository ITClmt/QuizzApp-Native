import { getAvatarImage } from "@/constants/avatars";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { useProfile } from "@/src/hooks/useProfile";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NAVBAR_BG = Colors.skyGradient[0];
/** Même teinte à alpha 0 : un "transparent" nu tire vers le gris sur iOS. */
const NAVBAR_BG_TRANSPARENT = `${NAVBAR_BG}00`;

export function Navbar() {
  const { user } = useAuth();
  const profile = useProfile();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("common");

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
      <View style={styles.brandRow}>
        <Text style={styles.appName}>QuizzApp</Text>
      </View>
      <View style={styles.rightGroup}>
        {profile && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>
              {t("levelBadge", { level: profile.level })}
            </Text>
          </View>
        )}
        <Pressable
          style={styles.avatarRing}
          onPress={() => router.push("/(app)/profile")}
          hitSlop={8} // 38px visuels + 8 de marge = plancher tactile atteint
          accessibilityRole="button"
          accessibilityLabel={t("openProfile")}
        >
          <Image
            source={getAvatarImage(profile?.avatarSlug ?? user?.avatarSlug)}
            style={styles.avatar}
            alt={user?.username}
          />
        </Pressable>
      </View>

      {/* Le contenu qui défile se fond dans la barre au lieu d'être tranché
          net à sa bordure. Débordement voulu : le header passe au-dessus de
          l'écran (zIndex de React Navigation). */}
      <LinearGradient
        colors={[NAVBAR_BG, NAVBAR_BG_TRANSPARENT]}
        style={styles.fade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: NAVBAR_BG,
  },
  fade: {
    position: "absolute",
    pointerEvents: "none",
    top: "100%",
    left: 0,
    right: 0,
    height: Spacing.base,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  appName: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleLg,
    color: Colors.onSurface,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  levelBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelSm,
    color: Colors.primary,
  },
  avatarRing: {
    padding: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
});
