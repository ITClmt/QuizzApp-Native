import { Colors, FontFamily, FontSize } from "@/constants/theme";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
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

// Grossissement de la pulsation d'urgence
const PULSE_SCALE = 1.06;

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
  // Trait et chiffre suivent la taille (référence : 150 px, le timer du solo).
  // Avec des valeurs fixes, un petit anneau n'a plus la place de les contenir.
  const scale = size / 150;
  const strokeWidth = Math.round(12 * scale);
  const numberSize = Math.round(FontSize.displayMd * scale);
  // En dessous, le libellé « secondes » déborde sur l'anneau (FR plus long que
  // EN) : le chiffre seul dans l'anneau se comprend très bien.
  const showUnit = size >= 120;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, secondsLeft / Math.max(1, totalSeconds)));
  const dashoffset = circumference * (1 - progress);

  const pulse = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Mouvement réduit : on coupe la pulsation, jamais le signal. L'urgence
    // reste lisible par le passage au rouge de l'anneau et du décompte.
    if (reduceMotion) {
      pulse.set(1);
      return;
    }

    if (urgent) {
      pulse.set(
        withRepeat(
          withSequence(
            withTiming(PULSE_SCALE, { duration: 400 }),
            withTiming(1, { duration: 400 }),
          ),
          -1,
          true,
        ),
      );
    } else {
      pulse.set(withTiming(1, { duration: 200 }));
    }
  }, [urgent, pulse, reduceMotion]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.get() }],
  }));

  const ringColor = urgent ? Colors.error : Colors.accentOrange;
  // Place réservée autour de l'anneau pour la pulsation : sans elle, il déborde
  // de quelques pixels et un parent qui coupe (ScrollView) le rogne en haut.
  const pulseRoom = Math.ceil((size * (PULSE_SCALE - 1)) / 2);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { width: size, height: size, margin: pulseRoom },
        pulseStyle,
      ]}
    >
      {/* Rotation sur le Svg entier pour que l'anneau parte de midi : la prop
          `origin` d'un Circle devient un attribut `transform-origin` invalide
          sur le web (React le signale en erreur) */}
      <Svg width={size} height={size} style={styles.startAtTop}>
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
        />
      </Svg>
      <View style={styles.center}>
        <Text
          style={[
            styles.number,
            { fontSize: numberSize },
            urgent && { color: Colors.error },
          ]}
        >
          {formatTime(secondsLeft)}
        </Text>
        {showUnit && (
          <Text style={styles.unit}>{t("session.secondsUnit")}</Text>
        )}
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
  startAtTop: {
    transform: [{ rotate: "-90deg" }],
  },
  center: {
    ...StyleSheet.absoluteFill,
    pointerEvents: "none",
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
