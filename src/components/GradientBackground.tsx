import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ViewProps } from "react-native";

export function GradientBackground({ style, children, ...rest }: ViewProps) {
  return (
    <LinearGradient
      colors={Colors.skyGradient as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.fill, style]}
      {...rest}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
