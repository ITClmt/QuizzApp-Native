import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

export default function SettingsScreen() {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.profileCard, { alignItems: "center" }]}>
        <Image
          source={getAvatarImage(user?.avatarSlug)}
          style={styles.avatarContainer}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user?.username || "N/A"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || "N/A"}</Text>
        </View>
      </View>

      <Pressable onPress={handleSignOut} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing["2xl"],
  },
  card: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing["4xl"],
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginVertical: Spacing.xs,
    opacity: 0.3,
  },
  label: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelLg,
    color: Colors.onSurfaceVariant,
  },
  value: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  logoutButton: {
    backgroundColor: Colors.errorContainer,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    alignItems: "center",
    ...Shadows.card,
  },
  logoutButtonText: {
    color: Colors.onErrorContainer,
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleMd,
  },

  profileCard: {
    marginBottom: Spacing["4xl"],
  },
  avatarContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
