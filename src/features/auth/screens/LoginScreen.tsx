import { Button } from "@/src/components/Button";
import { GradientBackground } from "@/src/components/GradientBackground";
import { Input } from "@/src/components/Input";
import { useAlert } from "@/src/contexts/AlertContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { ApiError, getErrorMessage } from "@/src/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
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
import { makeLoginSchema, type LoginFormValues } from "../schemas";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { showAlert } = useAlert();
  const { t } = useTranslation(["auth", "common"]);
  const loginSchema = useMemo(() => makeLoginSchema(t), [t]);
  // Renseigné au retour de la réinitialisation du mot de passe
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();

  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: emailParam ?? "", password: "" },
  });

  // L'écran existe déjà quand on y revient (dismissTo) : les defaultValues
  // ne sont pas relues, on pousse l'e-mail à la main
  useEffect(() => {
    if (emailParam) setValue("email", emailParam);
  }, [emailParam, setValue]);

  async function onSubmit(data: LoginFormValues) {
    try {
      await signIn(data.email.toLowerCase(), data.password);
      router.replace("/(app)");
    } catch (error) {
      if (error instanceof ApiError) {
        showAlert(t("common:errors.title"), getErrorMessage(error));
      } else {
        showAlert(t("common:errors.networkTitle"), t("errors.networkMessage"));
      }
    }
  }

  // Entrée sur le dernier champ envoie le formulaire, comme un vrai <form>.
  // Garde-fou : un second Entrée pendant l'envoi relancerait la requête.
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
          <Text style={styles.title}>{t("login.title")}</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <Input
                ref={ref}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => setFocus("password")}
                label={t("login.emailLabel")}
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

          <Controller
            control={control}
            name="password"
            render={({ field: { ref, onChange, onBlur, value } }) => (
              <Input
                ref={ref}
                returnKeyType="go"
                onSubmitEditing={submit}
                label={t("login.passwordLabel")}
                placeholder={t("login.passwordPlaceholder")}
                secureTextEntry
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(auth)/forgot-password",
                params: { email: getValues("email").trim().toLowerCase() },
              })
            }
            style={styles.forgotPasswordPressable}
            accessibilityRole="link"
          >
            <Text style={styles.forgotPasswordLink}>
              {t("login.forgotPassword")}
            </Text>
          </Pressable>

          <Button
            title={isSubmitting ? t("login.signingIn") : t("login.signIn")}
            style={styles.loginButton}
            onPress={submit}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{t("login.noAccount")}</Text>
          <Pressable
            onPress={() => router.replace("/(auth)/register")}
            style={styles.footerLinkPressable}
            accessibilityRole="link"
            accessibilityLabel={t("login.signUpLink")}
          >
            <Text style={styles.footerLink}>{t("login.signUpLink")}</Text>
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
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineLg,
    color: Colors.onSurface,
    marginBottom: Spacing.xs,
  },
  formContainer: {
    gap: Spacing.xl,
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  // Marge négative : rapproche le lien du champ mot de passe malgré le gap
  forgotPasswordPressable: {
    alignSelf: "flex-end",
    marginTop: -Spacing.md,
    paddingVertical: Spacing.xs,
  },
  forgotPasswordLink: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelLg,
    color: Colors.primary,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing["4xl"],
  },
  footerLinkPressable: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  footerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  footerLink: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelLg,
    color: Colors.primary,
  },
});
