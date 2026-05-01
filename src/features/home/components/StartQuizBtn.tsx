import { StyleSheet, Text, View, Pressable } from "react-native";
import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function StartQuizBtn() {
  return (
    <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <LinearGradient
        colors={["#4647d3", "#9396ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.backgroundIconContainer}>
          <MaterialIcons name="play-circle-filled" size={140} color={Colors.onPrimary} />
        </View>

        <MaterialIcons name="person" size={36} color={Colors.onPrimary} style={styles.icon} />
        <Text style={styles.title}>Solo Play</Text>
        <Text style={styles.subtitle}>Test your limits alone</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 180,
    borderRadius: 24,
    shadowColor: "#4647d3",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
    marginBottom: Spacing.xl,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  gradient: {
    flex: 1,
    borderRadius: 24,
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
