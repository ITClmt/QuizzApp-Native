import { BackButton } from "@/src/components/BackButton";
import { Button } from "@/src/components/Button";
import { GradientBackground } from "@/src/components/GradientBackground";
import { Input } from "@/src/components/Input";
import { useAlert } from "@/src/contexts/AlertContext";
import { ApiError, apiFetch, getErrorMessage } from "@/src/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "../../../../constants/theme";
import {
  makeResetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas";

// Aligné sur RESET_CODE_RESEND_COOLDOWN_MS côté back : plus tôt, le serveur
// ignorerait la demande sans rien dire
const RESEND_COOLDOWN_SECONDS = 60;

export default function ResetPasswordScreen() {
  const { showAlert } = useAlert();
  const { t } = useTranslation(["auth", "common"]);
  const schema = useMemo(() => makeResetPasswordSchema(t), [t]);
  const { email } = useLocalSearchParams<{ email?: string }>();

  // Un code vient de partir en arrivant sur l'écran
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const {
    control,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  // Ouvert directement par son URL (web) : sans e-mail, rien à réinitialiser
  if (!email) return <Redirect href="/(auth)/forgot-password" />;

  function showError(error: unknown) {
    if (error instanceof ApiError) {
      showAlert(t("common:errors.title"), getErrorMessage(error));
    } else {
      showAlert(t("common:errors.networkTitle"), t("errors.networkMessage"));
    }
  }

  async function onSubmit(data: ResetPasswordFormValues) {
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          code: data.code,
          newPassword: data.password,
        }),
      });
      showAlert(
        t("resetPassword.successTitle"),
        t("resetPassword.successMessage"),
      );
      // L'écran de connexion est déjà sous la pile : on y revient au lieu d'en
      // empiler un second
      router.dismissTo({ pathname: "/(auth)/login", params: { email } });
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === "AUTH_RESET_CODE_INVALID"
      ) {
        setError("code", { message: getErrorMessage(error) });
      } else {
        showError(error);
      }
    }
  }

  async function resend() {
    setIsResending(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      showAlert(
        t("resetPassword.resentTitle"),
        t("resetPassword.resentMessage"),
      );
    } catch (error) {
      showError(error);
    } finally {
      setIsResending(false);
    }
  }

  const submit = () => {
    if (!isSubmitting) handleSubmit(onSubmit)();
  };

  const canResend = cooldown <= 0 && !isResending;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.headerContainer}>
            <View style={styles.backButton}>
              <BackButton fallbackHref="/(auth)/forgot-password" />
            </View>
            <Text style={styles.title}>{t("resetPassword.title")}</Text>
            <Text style={styles.subtitle}>
              {t("resetPassword.subtitle", { email })}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="code"
              render={({ field: { ref, onChange, onBlur, value } }) => (
                <Input
                  ref={ref}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => setFocus("password")}
                  label={t("resetPassword.codeLabel")}
                  placeholder="123456"
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  maxLength={6}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.code?.message}
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
                  label={t("resetPassword.passwordLabel")}
                  placeholder={t("resetPassword.passwordPlaceholder")}
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
                  label={t("resetPassword.confirmPasswordLabel")}
                  placeholder={t("resetPassword.confirmPasswordPlaceholder")}
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
                  ? t("resetPassword.submitting")
                  : t("resetPassword.submit")
              }
              style={styles.submitButton}
              onPress={submit}
              disabled={isSubmitting}
            />
          </View>

          <View style={styles.footerContainer}>
            <Pressable
              onPress={resend}
              disabled={!canResend}
              style={styles.footerLinkPressable}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canResend }}
            >
              <Text
                style={[styles.footerLink, !canResend && styles.disabledLink]}
              >
                {cooldown > 0
                  ? t("resetPassword.resendIn", { seconds: cooldown })
                  : t("resetPassword.resend")}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: Spacing["2xl"],
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: Spacing["4xl"],
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineLg,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  formContainer: {
    gap: Spacing.xl,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: Spacing["2xl"],
  },
  footerLinkPressable: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  footerLink: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelLg,
    color: Colors.primary,
  },
  disabledLink: {
    color: Colors.onSurfaceVariant,
  },
});
