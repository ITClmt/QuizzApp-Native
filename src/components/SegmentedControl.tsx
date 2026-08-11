import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /**
   * "bar"    — pleine largeur, segments équirépartis (filtres d'écran)
   * "inline" — compact, se dimensionne au texte (réglage posé dans une ligne)
   */
  variant?: "bar" | "inline";
  disabled?: boolean;
  /** Décrit ce que le groupe pilote ("Difficulté", "Langue"…). */
  accessibilityLabel?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  variant = "bar",
  disabled = false,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const isBar = variant === "bar";

  return (
    <View
      style={isBar ? styles.trackBar : styles.trackInline}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active, disabled }}
            style={[
              isBar ? styles.segmentBar : styles.segmentInline,
              active && (isBar ? styles.segmentBarActive : styles.segmentInlineActive),
            ]}
          >
            <Text
              style={[
                isBar ? styles.labelBar : styles.labelInline,
                active && styles.labelActive,
              ]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // ─── Variante "bar" ───────────────────────────────────────
  trackBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 4,
    gap: 4,
    ...Shadows.card,
  },
  // 48 = plancher tactile Android (et > 44 pt iOS). Le hitSlop ne suffirait pas :
  // sur Android il est rogné par les bornes du parent, donc la taille est réelle.
  segmentBar: {
    flex: 1,
    minHeight: 48,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.xl - 4,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBarActive: {
    backgroundColor: Colors.primary,
  },
  labelBar: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelMd,
    color: Colors.onSurfaceVariant,
  },

  // ─── Variante "inline" ────────────────────────────────────
  trackInline: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.full,
    padding: 3,
    gap: 3,
  },
  // 44 pt : le plancher iOS. En ligne dans une rangée de réglages, monter à 48
  // déséquilibrerait la ligne face à son libellé sans gain tactile réel.
  segmentInline: {
    minHeight: 44,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentInlineActive: {
    backgroundColor: Colors.primary,
  },
  labelInline: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
  },

  labelActive: {
    color: Colors.onPrimary,
  },
});
