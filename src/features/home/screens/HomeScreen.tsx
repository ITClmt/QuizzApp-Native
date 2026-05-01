import { useAuth } from "@/src/contexts/AuthContext";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize } from "../../../../constants/theme";
import StartQuizBtn from "../components/StartQuizBtn";

export function HomeScreen() {
  const { user } = useAuth();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {user?.username}!</Text>
      </View>
      <View style={styles.bottomContainer}>
        <StartQuizBtn />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 40,
  },
  title: {
    fontSize: FontSize.headlineLg,
    fontWeight: "bold",
    color: Colors.onSurface,
  },
  bottomContainer: {
    padding: 20,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
