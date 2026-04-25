import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
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
import { useAuth } from "../../../contexts/AuthContext";
import { ApiError } from "../../../lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Auth ---
  const { signIn } = useAuth();

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Champs requis", "Remplis ton e-mail et ton mot de passe.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await signIn(email.trim(), password);
      router.replace("/(app)");
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert("Erreur", error.message);
      } else {
        Alert.alert(
          "Erreur réseau",
          "Impossible de joindre le serveur. Vérifie ta connexion.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* En-tête */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Content de te revoir</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <Input
            label="Adresse e-mail"
            placeholder="hello@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />

          {/* Bouton de validation */}
          <Button
            title={isSubmitting ? "Connexion..." : "Se connecter"}
            style={styles.loginButton}
            onPress={handleSignIn}
            disabled={isSubmitting}
          />
        </View>

        {/* Pied de page */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Pas encore de compte ? </Text>
          <Pressable onPress={() => router.replace("/(auth)/register")}>
            <Text style={styles.footerLink}>S'inscrire</Text>
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
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelMd,
    color: Colors.primary,
  },
  loginButton: {
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
