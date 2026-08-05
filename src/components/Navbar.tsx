import { getAvatarImage } from "@/constants/avatars";
import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { useProfile } from "@/src/hooks/useProfile";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Navbar() {
  const { user } = useAuth();
  const profile = useProfile();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[Colors.surfaceContainerLow, Colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.appNameRow}>
        <Text style={styles.appNamePrimary}>Quizz</Text>
        <Text style={styles.appNameSecondary}>App</Text>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing.base,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceDim,
  },
  appNameRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  appNamePrimary: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.titleLg,
    color: Colors.primary,
  },
  appNameSecondary: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.titleLg,
    color: Colors.secondary,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.primaryContainer,
  },
  levelBadgeText: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelSm,
    color: Colors.onPrimaryContainer,
  },
  avatarRing: {
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
