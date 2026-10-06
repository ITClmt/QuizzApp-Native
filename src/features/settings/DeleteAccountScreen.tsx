import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { BACK_BUTTON_SIZE, BackButton } from "@/src/components/BackButton";
import { GradientBackground } from "@/src/components/GradientBackground";
import { Input } from "@/src/components/Input";
import { useAlert } from "@/src/contexts/AlertContext";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  makeDeleteAccountSchema,
  type DeleteAccountFormValues,
} from "@/src/features/auth/schemas";
import { ApiError, getErrorMessage } from "@/src/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOSS_KEYS = [
  "lossLevel",
  "lossAvatars",
  "lossScores",
  "lossHistory",
  "lossFriends",
] as const;

export default function DeleteAccountScreen() {
  const { deleteAccount } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation(["settings", "auth", "common"]);
  const schema = makeDeleteAccountSchema(t);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  async function onConfirmed(password: string) {
    try {
      await deleteAccount(password);
      showAlert(
        t("deleteAccountScreen.doneTitle"),
        t("deleteAccountScreen.doneMessage"),
      );
      router.replace("/(auth)/login");
    } catch (error) {
      if (!(error instanceof ApiError)) {
        showAlert(
          t("common:errors.networkTitle"),
          t("auth:errors.networkMessage"),
        );
      } else if (error.code === "AUTH_WRONG_PASSWORD") {
        setError("password", { message: getErrorMessage(error) });
      } else if (error.code === "ALREADY_IN_GAME") {
        // Le message générique ("déjà en pleine partie") ne dit pas quoi faire ici
        showAlert(t("common:errors.title"), t("deleteAccountScreen.inGame"));
      } else {
        showAlert(t("common:errors.title"), getErrorMessage(error));
      }
    }
  }

  // Dernière confirmation une fois le formulaire valide : le mot de passe
  // prouve que c'est bien le propriétaire, l'alerte évite le geste réflexe
  function onSubmit(data: DeleteAccountFormValues) {
    return new Promise<void>((resolve) => {
      showAlert(
        t("deleteAccountScreen.confirmTitle"),
        t("deleteAccountScreen.confirmMessage"),
        [
          { text: t("common:cancel"), style: "cancel", onPress: () => resolve() },
          {
            text: t("deleteAccountScreen.confirmButton"),
            style: "destructive",
            onPress: () => onConfirmed(data.password).finally(resolve),
          },
        ],
        { onDismiss: () => resolve() },
      );
    });
  }

  const submit = () => {
    if (!isSubmitting) handleSubmit(onSubmit)();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <BackButton fallbackHref="/(app)/settings" />
          <Text style={styles.title}>{t("deleteAccountScreen.title")}</Text>
          {/* Contrepoids du bouton, pour garder le titre centré */}
          <View style={styles.backButtonSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.warning}>
                {t("deleteAccountScreen.warning")}
              </Text>
              {LOSS_KEYS.map((key) => (
                <Text key={key} style={styles.lossItem}>
                  {`•  ${t(`deleteAccountScreen.${key}`)}`}
                </Text>
              ))}
            </View>

            <Controller
              control={control}
              name="password"
              render={({ field: { ref, onChange, onBlur, value } }) => (
                <Input
                  ref={ref}
                  returnKeyType="go"
                  onSubmitEditing={submit}
                  label={t("deleteAccountScreen.passwordLabel")}
                  placeholder={t("deleteAccountScreen.passwordPlaceholder")}
                  secureTextEntry
                  autoComplete="current-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <Pressable
              onPress={submit}
              disabled={isSubmitting}
              style={[styles.deleteButton, isSubmitting && styles.disabled]}
              accessibilityRole="button"
            >
              <Text style={styles.deleteButtonText}>
                {isSubmitting
                  ? t("deleteAccountScreen.submitting")
                  : t("deleteAccountScreen.submit")}
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineMd,
    color: Colors.onBackground,
    textAlign: "center",
  },
  backButtonSpacer: {
    width: BACK_BUTTON_SIZE,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: Spacing["2xl"],
    gap: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  warning: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  lossItem: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  // Même habillage que le bouton de déconnexion des paramètres
  deleteButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.error,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    ...Shadows.card,
  },
  deleteButtonText: {
    color: Colors.error,
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleMd,
  },
  disabled: {
    opacity: 0.6,
  },
});
