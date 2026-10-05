import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameInvitations } from "../hooks/useGameInvitations";

/**
 * Écrans où la bannière se tait : l'accueil affiche déjà les invitations en
 * cartes, le salon et la création sont déjà du multijoueur, et en pleine
 * partie (solo ou multi) le chrono tourne — une bannière y coûterait des points.
 */
const HIDDEN_ON = ["/", "/login", "/register", "/create", "/quiz"];
const HIDDEN_UNDER = ["/lobby", "/game"];

/**
 * Invitation reçue pendant qu'on est ailleurs dans l'app. Montée une seule fois
 * dans Providers ; affiche la plus récente invitation non masquée.
 */
export function InvitationBanner() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation("multiplayer");
  const { data: invitations } = useGameInvitations();
  // Masquée pour cette session seulement : elle reste visible sur l'accueil
  const [dismissed, setDismissed] = useState<string[]>([]);

  const invitation = invitations?.find((i) => !dismissed.includes(i.gameId));
  const hidden =
    !user ||
    !invitation ||
    HIDDEN_ON.includes(pathname) ||
    HIDDEN_UNDER.some((prefix) => pathname.startsWith(prefix));
  if (hidden) return null;

  const { host, gameId } = invitation;

  return (
    <View style={[styles.wrapper, { top: top + Spacing.sm }]}>
      <View style={styles.card}>
        <Image source={getAvatarImage(host.avatarSlug)} style={styles.avatar} />
        <Text style={styles.message} numberOfLines={2}>
          {t("banner.message", { username: host.username })}
        </Text>
        <Pressable
          onPress={() =>
            router.push({ pathname: "/lobby/[gameId]", params: { gameId } })
          }
          accessibilityRole="button"
          accessibilityLabel={t("banner.openLabel", { username: host.username })}
          style={({ pressed }) => [styles.open, pressed && styles.pressed]}
        >
          <Text style={styles.openText}>{t("banner.open")}</Text>
        </Pressable>
        <Pressable
          onPress={() => setDismissed((ids) => [...ids, gameId])}
          accessibilityRole="button"
          accessibilityLabel={t("banner.dismiss")}
          style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]}
        >
          <MaterialIcons name="close" size={20} color={Colors.outline} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 9998,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.md,
    ...Shadows.elevated,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
  },
  message: {
    flex: 1,
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurface,
  },
  open: {
    minHeight: 40,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  openText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyMd,
    color: Colors.onPrimary,
  },
  // 48 de cible : la croix est petite mais doit rester facile à toucher
  dismiss: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});
