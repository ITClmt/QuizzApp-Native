import { BackButton } from "@/src/components/BackButton";
import { Button } from "@/src/components/Button";
import { GradientBackground } from "@/src/components/GradientBackground";
import { Input } from "@/src/components/Input";
import { useAlert } from "@/src/contexts/AlertContext";
import { ApiError, apiFetch, getErrorMessage } from "@/src/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
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
  makeForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas";

export default function ForgotPasswordScreen() {
  const { showAlert } = useAlert();
  const { t } = useTranslation(["auth", "common"]);
  const schema = makeForgotPasswordSchema(t);
  // Prérempli avec ce qui était déjà tapé sur l'écran de connexion
  const { email: initialEmail } = useLocalSearchParams<{ email?: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: initialEmail ?? "" },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    const email = data.email.toLowerCase();
    try {
      // Toujours 204, que le compte existe ou non : on passe à la suite
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      router.push({ pathname: "/(auth)/reset-password", params: { email } });
    } catch (error) {
      if (error instanceof ApiError) {
        showAlert(t("common:errors.title"), getErrorMessage(error));
      } else {
        showAlert(t("common:errors.networkTitle"), t("errors.networkMessage"));
      }
    }
  }

  const submit = () => {
    if (!isSubmitting) handleSubmit(onSubmit)();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.headerContainer}>
            <View style={styles.backButton}>
              <BackButton fallbackHref="/(auth)/login" />
            </View>
            <Text style={styles.title}>{t("forgotPassword.title")}</Text>
            <Text style={styles.subtitle}>{t("forgotPassword.subtitle")}</Text>
          </View>

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { ref, onChange, onBlur, value } }) => (
                <Input
                  ref={ref}
                  returnKeyType="go"
                  onSubmitEditing={submit}
                  label={t("forgotPassword.emailLabel")}
                  placeholder="hello@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <Button
              title={
                isSubmitting
                  ? t("forgotPassword.sending")
                  : t("forgotPassword.send")
              }
              style={styles.submitButton}
              onPress={submit}
              disabled={isSubmitting}
            />
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
});
