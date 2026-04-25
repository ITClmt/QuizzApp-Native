import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { router } from "expo-router";
import { useState } from "react";
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

export default function RegisterScreen() {
  // --- États (State) ---
  // On prépare les états pour le formulaire. On utilisera `useState` pour contrôler nos inputs.
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // La logique API viendra ici plus tard
    console.log("Register pressed", { username, email, password, confirmPassword });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* En-tête */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Rejoins-nous pour commencer l'aventure
          </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <Input
            label="Nom d'utilisateur"
            placeholder="Ton pseudo"
            autoCapitalize="words"
            value={username}
            onChangeText={setUsername}
          />

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
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
          />

          <Input
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Bouton de validation */}
          <Button
            title="S'inscrire"
            style={styles.registerButton}
            onPress={handleRegister}
          />
        </View>

        {/* Pied de page */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Déjà un compte ? </Text>
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.footerLink}>Se connecter</Text>
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
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurfaceVariant,
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
