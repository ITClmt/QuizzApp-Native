import { GradientBackground } from "@/src/components/GradientBackground";
import { LevelProgressBar } from "@/src/components/LevelProgressBar";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontFamily, FontSize, Spacing } from "../../../../constants/theme";
import StartQuizBtn from "../components/StartQuizBtn";

export function HomeScreen() {
  const { user } = useAuth();
  const { t } = useTranslation("home");
  return (
    <GradientBackground>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{t("welcome", { username: user?.username })}</Text>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.levelBarWrapper}>
            <LevelProgressBar />
          </View>
          <StartQuizBtn />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: Spacing.xl,
    paddingTop: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineLg,
    color: Colors.onSurface,
  },
  bottomContainer: {
    padding: Spacing.xl,
    paddingBottom: Spacing["4xl"] + Spacing.xl,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  levelBarWrapper: {
    width: "100%",
    marginBottom: Spacing.xl,
  },
});
