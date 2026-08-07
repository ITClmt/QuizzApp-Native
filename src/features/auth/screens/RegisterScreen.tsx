import { Button } from "@/src/components/Button";
import { GradientBackground } from "@/src/components/GradientBackground";
import { Input } from "@/src/components/Input";
import { useAuth } from "@/src/contexts/AuthContext";
import { i18n } from "@/src/i18n";
import { ApiError } from "@/src/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Alert,
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
import { makeRegisterSchema, type RegisterFormValues } from "../schemas";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { t } = useTranslation(["auth", "common"]);
  const registerSchema = useMemo(() => makeRegisterSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      // La langue affichée à l'écran (déjà résolue via expo-localization au
      // démarrage) devient la langue du compte créé.
      await signUp(data.email, data.password, data.username, i18n.language);
      router.replace("/(app)");
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert(t("common:errors.title"), error.message);
      } else {
        Alert.alert(t("common:errors.networkTitle"), t("errors.networkMessage"));
      }
    }
  }

  return (
    <GradientBackground>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{t("register.title")}</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("register.usernameLabel")}
                placeholder={t("register.usernamePlaceholder")}
                autoCapitalize="words"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("register.emailLabel")}
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
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("register.passwordLabel")}
                placeholder="••••••••"
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
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t("register.confirmPasswordLabel")}
                placeholder="••••••••"
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
            title={isSubmitting ? t("register.signingUp") : t("register.signUp")}
            style={styles.registerButton}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{t("register.hasAccount")}</Text>
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.footerLink}>{t("register.signInLink")}</Text>
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
  registerButton: {
    marginTop: Spacing.md,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing["4xl"],
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
