import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation("common");

  if (isOnline) return null;

  return (
    <View
      style={[styles.banner, { paddingBottom: bottom + Spacing.sm }]}
      // Purement informatif : il ne doit jamais intercepter un appui destiné
      // à la barre de navigation qu'il recouvre.
      pointerEvents="none"
    >
      <View style={styles.content}>
        <MaterialIcons name="wifi-off" size={18} color={Colors.onError} />
        <Text style={styles.text}>{t("offline")}</Text>
      </View>
    </View>
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
