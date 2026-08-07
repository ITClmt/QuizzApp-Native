import { Colors, Radius, Spacing } from "@/constants/theme";
import { i18n } from "@/src/i18n";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface State {
  hasError: boolean;
  error: Error | null;
}

// Classe (pas de hooks disponibles) : on lit directement l'instance i18n
// partagée plutôt que useTranslation().
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{i18n.t("common:errorBoundary.title")}</Text>
          <Text style={styles.message}>{this.state.error?.message}</Text>
          <Pressable
            style={styles.button}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.buttonText}>
              {i18n.t("common:errorBoundary.tryAgain")}
            </Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.onSurface,
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  button: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.onPrimary,
  },
});
