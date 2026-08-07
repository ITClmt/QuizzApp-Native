import { getAvatarImage } from "@/constants/avatars";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { useProfile } from "@/src/hooks/useProfile";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Navbar() {
  const { user } = useAuth();
  const profile = useProfile();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
      <View style={styles.brandRow}>
        <Text style={styles.appName}>QuizzApp</Text>
      </View>
      <View style={styles.rightGroup}>
        {profile && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>Lvl {profile.level}</Text>
          </View>
        )}
        <Pressable
          style={styles.avatarRing}
          onPress={() => router.push("/(app)/profile")}
        >
          <Image
            source={getAvatarImage(user?.avatarSlug)}
            style={styles.avatar}
            alt={user?.username}
          />
        </Pressable>
      </View>
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
    backgroundColor: Colors.skyGradient[0],
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
