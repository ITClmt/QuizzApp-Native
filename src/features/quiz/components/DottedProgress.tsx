import { Colors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface DottedProgressProps {
  total: number;
  current: number;
}

export function DottedProgress({ total, current }: DottedProgressProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index <= current && styles.dotActive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  dot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
});
