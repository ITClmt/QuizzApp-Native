import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "@/constants/theme";
import { BACK_BUTTON_SIZE, BackButton } from "@/src/components/BackButton";
import { Button } from "@/src/components/Button";
import { GradientBackground } from "@/src/components/GradientBackground";
import { Input } from "@/src/components/Input";
import { useAlert } from "@/src/contexts/AlertContext";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  makeChangePasswordSchema,
  type ChangePasswordFormValues,
} from "@/src/features/auth/schemas";
import { ApiError, getErrorMessage } from "@/src/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation(["settings", "auth", "common"]);
  const schema = makeChangePasswordSchema(t);

  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: ChangePasswordFormValues) {
    try {
      await changePassword(data.currentPassword, data.password);
      showAlert(
        t("changePasswordScreen.successTitle"),
        t("changePasswordScreen.successMessage"),
      );
      router.back();
    } catch (error) {
      if (!(error instanceof ApiError)) {
        showAlert(
          t("common:errors.networkTitle"),
          t("auth:errors.networkMessage"),
        );
      } else if (error.code === "AUTH_WRONG_PASSWORD") {
        setError("currentPassword", { message: getErrorMessage(error) });
      } else if (error.code === "PASSWORD_UNCHANGED") {
        setError("password", { message: getErrorMessage(error) });
      } else {
        showAlert(t("common:errors.title"), getErrorMessage(error));
      }
    }
  }

  const submit = () => {
    if (!isSubmitting) handleSubmit(onSubmit)();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <BackButton fallbackHref="/(app)/settings" />
          <Text style={styles.title}>{t("changePasswordScreen.title")}</Text>
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
            <Text style={styles.subtitle}>
              {t("changePasswordScreen.otherDevices")}
            </Text>

            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { ref, onChange, onBlur, value } }) => (
                <Input
                  ref={ref}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => setFocus("password")}
                  label={t("changePasswordScreen.currentPasswordLabel")}
                  placeholder={t(
                    "changePasswordScreen.currentPasswordPlaceholder",
                  )}
                  secureTextEntry
                  autoComplete="current-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.currentPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { ref, onChange, onBlur, value } }) => (
                <Input
                  ref={ref}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => setFocus("confirmPassword")}
                  label={t("changePasswordScreen.newPasswordLabel")}
                  placeholder={t("changePasswordScreen.newPasswordPlaceholder")}
                  secureTextEntry
                  autoComplete="new-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { ref, onChange, onBlur, value } }) => (
                <Input
                  ref={ref}
                  returnKeyType="go"
                  onSubmitEditing={submit}
                  label={t("changePasswordScreen.confirmPasswordLabel")}
                  placeholder={t(
                    "changePasswordScreen.confirmPasswordPlaceholder",
                  )}
                  secureTextEntry
                  autoComplete="new-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Button
              title={
                isSubmitting
                  ? t("changePasswordScreen.submitting")
                  : t("changePasswordScreen.submit")
              }
              style={styles.submitButton}
              onPress={submit}
              disabled={isSubmitting}
            />
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
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
});
