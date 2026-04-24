import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Colors,
  FontFamily,
  FontSize,
  Spacing,
} from "../../../../constants/theme";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* En-tête */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Content de te revoir</Text>
          <Text style={styles.subtitle}>
            Connecte-toi pour reprendre ton quizz
          </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <Input
            label="Adresse e-mail"
            placeholder="hello@exemple.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
          />

          {/* Mot de passe oublié */}
          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </Pressable>

          {/* Bouton de validation */}
          <Button title="Se connecter" style={styles.loginButton} />
        </View>

        {/* Pied de page */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Pas encore de compte ? </Text>
          <Pressable>
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
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurfaceVariant,
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
