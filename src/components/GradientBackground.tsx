import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, ViewProps } from "react-native";

/**
 * `supportsTablet: false` ne couvre qu'iOS : sur tablette et pliable Android,
 * l'appli s'installe quand même. Le dégradé occupe tout l'écran, mais le contenu
 * reste dans une colonne centrée pour ne pas étirer une mise en page pensée pour
 * le téléphone. Sans effet en dessous de 640 (tous les téléphones).
 */
const CONTENT_MAX_WIDTH = 640;

export function GradientBackground({ style, children, ...rest }: ViewProps) {
  return (
    <LinearGradient
      colors={Colors.skyGradient as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.fill, style]}
      {...rest}
    >
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
  },
});
