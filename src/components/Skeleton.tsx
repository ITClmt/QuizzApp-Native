import { Colors, Radius } from "@/constants/theme";
import { useEffect } from "react";
import type { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Bloc gris qui "respire" à la place d'un contenu en chargement : la page
 * garde sa forme au lieu d'une roue au milieu du vide, puis d'un saut de mise
 * en page à l'arrivée des données.
 */
export function Skeleton({
  width = "100%",
  height = 14,
  radius = Radius.sm,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    opacity.set(withRepeat(withTiming(0.5, { duration: 700 }), -1, true));
  }, [opacity, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: Colors.surfaceContainerHighest,
        },
        animatedStyle,
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
