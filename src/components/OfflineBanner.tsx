import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const { bottom } = useSafeAreaInsets();
  const translateY = useSharedValue(100);
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation("common");

  useEffect(() => {
    const target = isOnline ? 100 : 0;
    // Mouvement réduit : le bandeau apparaît/disparaît net, sans glissement.
    translateY.value = reduceMotion
      ? target
      : withTiming(target, { duration: 300 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.banner,
        { paddingBottom: bottom + Spacing.sm },
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <MaterialIcons name="wifi-off" size={18} color={Colors.onError} />
        <Text style={styles.text}>{t("offline")}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.error,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.base,
    zIndex: 9999,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  text: {
    color: Colors.onError,
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
  },
});
