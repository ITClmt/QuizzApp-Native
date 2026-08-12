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

  const tabs: { value: ProfileTab; label: string }[] = [
    { value: "scores", label: t("scoresByDifficulty") },
    { value: "history", label: t("tabs.history") },
  ];

  return (
    <View>
      <View style={styles.row} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const active = activeTab === tab.value;
          return (
            <Pressable
              key={tab.value}
              onPress={() => onChange(tab.value)}
              style={({ pressed }) => [
                styles.tab,
                active && styles.tabActive,
                pressed && styles.pressed,
              ]}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
            >
              <Text
                style={[styles.title, !active && styles.inactive]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  tab: {
    minHeight: 48,
    flexShrink: 1,
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  pressed: {
    opacity: 0.8,
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
  },
});
