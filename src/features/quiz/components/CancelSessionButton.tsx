import { Colors, Shadows } from "@/constants/theme";
import { cancelQuizSession } from "@/src/services/quiz/quiz.api";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet } from "react-native";

interface CancelSessionButtonProps {
  sessionId: string;
}

export default function CancelSessionButton({
  sessionId,
}: CancelSessionButtonProps) {
  const router = useRouter();
  const { t } = useTranslation(["quiz", "common"]);

  const { mutate: cancelSession, isPending } = useMutation({
    mutationFn: () => cancelQuizSession(sessionId),

    onSuccess: () => {
      router.replace("/(app)");
    },

    onError: (err: Error) => {
      Alert.alert(
        t("common:errors.title"),
        t("session.cancelError", { message: err.message }),
      );
    },
  });

  // Affiche une modale de confirmation native avant d'appeler l'API.
  // Alert.alert() est synchrone côté affichage : il bloque l'UI et attend
  // le choix de l'utilisateur avant d'exécuter le callback.
  const handlePress = () => {
    Alert.alert(
      t("session.cancelConfirmTitle"), // Titre
      t("session.cancelConfirmMessage"), // Message
      [
        {
          text: t("session.keepPlaying"),
          style: "cancel", // Sur iOS : met ce bouton en gras (action "safe")
        },
        {
          text: t("session.quit"),
          style: "destructive", // Sur iOS : affiche en rouge pour signaler le danger
          onPress: () => cancelSession(),
        },
      ],
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.button}
      hitSlop={8} // Agrandit la zone de clic sans changer l'apparence visuelle
      disabled={isPending} // Évite un double-tap pendant le call réseau
      accessibilityLabel={t("session.cancelAccessibilityLabel")}
      accessibilityRole="button"
    >
      <MaterialIcons
        name="close"
        size={20}
        // Feedback visuel subtil pendant le chargement
        color={isPending ? Colors.onSurfaceVariant : Colors.onSurface}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
});
