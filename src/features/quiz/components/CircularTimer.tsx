import { Colors, FontFamily, FontSize } from "@/constants/theme";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

interface CircularTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  urgent?: boolean;
  size?: number;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes}:${seconds.toString().padStart(2, "0")}`
    : `${seconds}`;
}

export function CircularTimer({
  secondsLeft,
  totalSeconds,
  urgent = false,
  size = 150,
}: CircularTimerProps) {
  const { t } = useTranslation("quiz");
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, secondsLeft / Math.max(1, totalSeconds)));
  const dashoffset = circumference * (1 - progress);

  const pulse = useSharedValue(1);

  useEffect(() => {
    if (urgent) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 400 }),
          withTiming(1, { duration: 400 }),
        ),
        -1,
        true,
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [urgent, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const ringColor = urgent ? Colors.error : Colors.accentOrange;

  return (
    <Animated.View style={[styles.wrapper, { width: size, height: size }, pulseStyle]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.secondaryContainer}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.number, urgent && { color: Colors.error }]}>
          {formatTime(secondsLeft)}
        </Text>
        <Text style={styles.unit}>{t("session.secondsUnit")}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.displayMd,
    color: Colors.onSurface,
    fontVariant: ["tabular-nums"],
  },
  unit: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: -2,
  },
});
