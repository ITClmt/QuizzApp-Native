import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { Button } from "@/src/components/Button";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface ProfileErrorNoticeProps {
  message: string;
  onRetry: () => void;
}

export function ProfileErrorNotice({
  message,
  onRetry,
}: ProfileErrorNoticeProps) {
  const { t } = useTranslation("common");

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Button
        variant="outlined"
        title={t("errorBoundary.tryAgain")}
        onPress={onRetry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
    gap: Spacing.base,
  },
  message: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.error,
    textAlign: "center",
  },
});
