import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { useAuth } from "@/src/contexts/AuthContext";
import { ApiError } from "@/src/lib/api";
import * as Localization from "expo-localization";
import { router } from "expo-router";
import { useState } from "react";
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

export default function RegisterScreen() {
  // --- États (State) ---
  // On prépare les états pour le formulaire. On utilisera `useState` pour contrôler nos inputs.
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!email.trim() || !password.trim() || !username.trim()) {
      Alert.alert(
        "Required fields",
        "Please enter your email, password, and username.",
      );
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Détection de la langue du système
      const locales = Localization.getLocales();
      let lang = "en";
      
      // getLocales() renvoie une liste, on prend la première langue préférée
      if (locales && locales.length > 0 && locales[0].languageCode === "fr") {
        lang = "fr";
      }

      await signUp(email.trim(), password, username.trim(), lang);
      router.replace("/(app)");
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert(
          "Network Error",
          "Unable to reach the server. Check your connection.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* En-tête */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create an account</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <Input
            label="Username"
            placeholder="Your username"
            autoCapitalize="words"
            value={username}
            onChangeText={setUsername}
          />

          <Input
            label="Email Address"
            placeholder="hello@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />

          <Input
            label="Confirm password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Bouton de validation */}
          <Button
            title={isSubmitting ? "Signing up..." : "Sign up"}
            style={styles.registerButton}
            onPress={handleRegister}
          />
        </View>

        {/* Pied de page */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
