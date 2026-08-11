import { Colors, Radius } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface QuestionProgressProps {
  total: number;
  current: number;
}

export function QuestionProgress({ total, current }: QuestionProgressProps) {
  const answered = Math.min(current + 1, Math.max(total, 1));
  const progress = total > 0 ? answered / total : 0;

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: answered }}
    >
      <View style={[styles.fill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.outlineVariant,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
});
