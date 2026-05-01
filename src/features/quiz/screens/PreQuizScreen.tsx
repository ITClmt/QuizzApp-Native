import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import { Button } from "@/src/components/Button";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PreQuizScreen() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );

  const handleDifficulty = (difficulty: string) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
      return;
    }

    setSelectedDifficulty(difficulty);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Difficulty</Text>

        <View style={styles.difficultiesContainer}>
          <Button
            variant={selectedDifficulty === "easy" ? "outlined" : "secondary"}
            title="easy"
            onPress={() => handleDifficulty("easy")}
            style={styles.difficultyBtn}
          />
          <Button
            variant={selectedDifficulty === "medium" ? "outlined" : "secondary"}
            title="medium"
            onPress={() => handleDifficulty("medium")}
            style={styles.difficultyBtn}
          />
          <Button
            variant={selectedDifficulty === "hard" ? "outlined" : "secondary"}
            title="hard"
            onPress={() => handleDifficulty("hard")}
            style={styles.difficultyBtn}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          variant="primary"
          title="Start Quiz"
          onPress={() => {
            router.replace({
              pathname: "/(quiz)/quiz",
              params: selectedDifficulty ? { difficulty: selectedDifficulty } : {},
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineMd,
    color: Colors.onBackground,
    marginBottom: Spacing["2xl"],
    textAlign: "center",
  },
  difficultiesContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  difficultyBtn: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.md, // Écrase le Radius.full par défaut du composant Button pour un effet moins "pilule"
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
});
