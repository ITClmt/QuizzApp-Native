import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "../../constants/theme";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary";
}

export function Button({
  title,
  variant = "primary",
  style,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryBg : styles.secondaryBg,
        pressed && { opacity: 0.8 },
        typeof style === "function"
          ? style({
              pressed,
              hovered: false,
            })
          : style,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBg: {
    backgroundColor: Colors.primary,
  },
  secondaryBg: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  text: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.titleMd,
  },
  primaryText: {
    color: Colors.onPrimary,
  },
  secondaryText: {
    color: Colors.onSurface,
  },
});
