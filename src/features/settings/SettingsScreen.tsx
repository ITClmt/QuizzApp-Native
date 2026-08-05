import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

export default function SettingsScreen() {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
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
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing["4xl"],
    ...Shadows.card,
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
  },
  label: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelLg,
    color: Colors.onSurfaceVariant,
  },
  value: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  logoutButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.error,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    ...Shadows.card,
  },
  logoutButtonText: {
    color: Colors.error,
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleMd,
  },
});
