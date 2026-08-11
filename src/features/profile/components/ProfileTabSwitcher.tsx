import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type ProfileTab = "scores" | "history";

interface ProfileTabSwitcherProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export function ProfileTabSwitcher({
  activeTab,
  onChange,
}: ProfileTabSwitcherProps) {
  const { t } = useTranslation("profile");

  return (
    <View>
      <View style={styles.row}>
        <Pressable onPress={() => onChange("scores")}>
          <Text style={[styles.title, activeTab !== "scores" && styles.inactive]}>
            {t("scoresByDifficulty")}
          </Text>
        </Pressable>
        <Pressable onPress={() => onChange("history")}>
          <Text style={[styles.title, activeTab !== "history" && styles.inactive]}>
            {t("tabs.history")}
          </Text>
        </Pressable>
      </View>
      <View style={styles.underline} />
    </View>
  );
}

// Même style que l'ancien titre de section unique : les onglets doivent
// garder ce look, seule la couleur change pour distinguer actif/inactif.
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleMd,
    color: Colors.onSurface,
  },
  inactive: {
    color: Colors.outline,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginTop: Spacing.sm,
  },
});
