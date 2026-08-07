import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StartQuizBtn() {
  const router = useRouter();
  const { isOnline } = useNetworkStatus();
  const { t } = useTranslation("home");

  return (
    <Pressable
      onPress={() => isOnline && router.push("/(quiz)/preQuiz")}
      style={({ pressed }) => [
        styles.container,
        pressed && isOnline && styles.pressed,
        !isOnline && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.inversePrimary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.backgroundIconContainer}>
          <MaterialIcons
            name="play-circle-filled"
            size={140}
            color={Colors.onPrimary}
          />
        </View>

        <MaterialIcons
          name="person"
          size={36}
          color={Colors.onPrimary}
          style={styles.icon}
        />
        <Text style={styles.title}>{t("soloPlay")}</Text>
        <Text style={styles.subtitle}>{t("soloPlaySubtitle")}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 180,
    borderRadius: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: Spacing.xl,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    flex: 1,
    borderRadius: 18,
    padding: Spacing["2xl"],
    justifyContent: "flex-end",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  backgroundIconContainer: {
    position: "absolute",
    top: -20,
    right: -20,
    opacity: 0.1,
  },
  icon: {
    marginBottom: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineSm,
    color: Colors.onPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyMd,
    color: Colors.onPrimary,
    opacity: 0.8,
  },
});
