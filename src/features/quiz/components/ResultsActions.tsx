import { Colors, Radius, Spacing } from "@/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ResultsActionsProps {
  onReplay: () => void;
  onHome: () => void;
}

export default function ResultsActions({
  onReplay,
  onHome,
}: ResultsActionsProps) {
  return (
    <View style={styles.actions}>
      <Pressable style={styles.replayButton} onPress={onReplay}>
        <Text style={styles.replayButtonText}>Play again</Text>
      </Pressable>
      <Pressable style={styles.homeButton} onPress={onHome}>
        <Text style={styles.homeButtonText}>Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
  },
  replayButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
  },
  replayButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  homeButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.onPrimary,
  },
});
