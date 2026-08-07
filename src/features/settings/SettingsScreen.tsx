import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import { SUPPORTED_LANGUAGES, setAppLanguage, type AppLanguage } from "@/src/i18n";
import { updateUserRequest } from "@/src/services/users/users.api";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

const LANGUAGE_LABEL_KEYS: Record<AppLanguage, "languageFr" | "languageEn"> = {
  fr: "languageFr",
  en: "languageEn",
};

export default function SettingsScreen() {
  const { signOut, user } = useAuth();
  const { t, i18n } = useTranslation(["settings", "common"]);

  // Applique la langue localement, puis persiste côté compte. Le backend lit
  // désormais User.lang en base à chaque requête (pas depuis le JWT), donc
  // pas besoin de rafraîchir le token pour que ça prenne effet immédiatement.
  const { mutate: applyLanguageChange, isPending: isChangingLanguage } = useMutation({
    mutationFn: async (lang: AppLanguage) => {
      await setAppLanguage(lang);
      if (user) await updateUserRequest(user.sub, { lang });
    },
  });

  const handleLanguageChange = (lang: AppLanguage) => {
    if (lang === i18n.language || isChangingLanguage) return;

    Alert.alert(
      t("languageConfirmTitle"),
      t("languageConfirmMessage", { language: t(LANGUAGE_LABEL_KEYS[lang]) }),
      [
        { text: t("common:cancel"), style: "cancel" },
        { text: t("common:confirm"), onPress: () => applyLanguageChange(lang) },
      ],
    );
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <GradientBackground>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t("username")}</Text>
            <Text style={styles.value}>{user?.username || t("notAvailable")}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t("email")}</Text>
            <Text style={styles.value}>{user?.email || t("notAvailable")}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t("language")}</Text>
            <View style={styles.languageSwitch}>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const active = i18n.language === lang;
                return (
                  <Pressable
                    key={lang}
                    onPress={() => handleLanguageChange(lang)}
                    disabled={isChangingLanguage}
                    style={[styles.languagePill, active && styles.languagePillActive]}
                  >
                    <Text
                      style={[
                        styles.languagePillText,
                        active && styles.languagePillTextActive,
                      ]}
                    >
                      {t(LANGUAGE_LABEL_KEYS[lang])}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <Pressable onPress={handleSignOut} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>{t("logout")}</Text>
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
  languageSwitch: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.full,
    padding: 3,
    gap: 3,
  },
  languagePill: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
  },
  languagePillActive: {
    backgroundColor: Colors.primary,
  },
  languagePillText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
  },
  languagePillTextActive: {
    color: Colors.onPrimary,
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
