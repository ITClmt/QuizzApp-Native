import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "../../../../constants/theme";
import { Button } from "../../../components/Button";

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Lumina Quiz</Text>
          <Text style={styles.subtitle}>
            Test your knowledge and improve every day with this challenge.
          </Text>
        </View>

        {/* Action Section */}
        <View style={styles.actionCard}>
          <Text style={styles.cardTitle}>Ready for the challenge?</Text>
          <Button
            title="Start a session"
            onPress={() => console.log("Start Quiz")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "space-between",
  },
  header: {
    marginTop: Spacing["4xl"],
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.displayMd,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurfaceVariant,
  },
  actionCard: {
    backgroundColor: Colors.surfaceContainer,
    padding: Spacing["2xl"],
    borderRadius: Radius.xl,
    ...Shadows.card,
    marginBottom: Spacing["4xl"],
  },
  cardTitle: {
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleLg,
    color: Colors.onSurface,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
});
