import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/src/components/Button";
import { Colors, FontFamily, FontSize, Spacing, Radius } from "@/constants/theme";

export default function PreQuizScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Difficulty</Text>

        <View style={styles.difficultiesContainer}>
          <Button 
            variant="secondary" 
            title="Easy" 
            onPress={() => {}} 
            style={styles.difficultyBtn}
          />
          <Button 
            variant="secondary" 
            title="Medium" 
            onPress={() => {}} 
            style={styles.difficultyBtn}
          />
          <Button 
            variant="secondary" 
            title="Hard" 
            onPress={() => {}} 
            style={styles.difficultyBtn}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          variant="primary" 
          title="Start Quiz" 
          onPress={() => {}} 
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


