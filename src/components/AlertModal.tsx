import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type AlertButton,
} from "react-native";

interface AlertModalProps {
  title: string;
  message?: string;
  buttons: AlertButton[];
  cancelable: boolean;
  onDismiss: () => void;
  onPress: (button: AlertButton) => void;
}

/**
 * Présentation d'une alerte, sans état : elle n'est montée que pendant son
 * affichage, c'est AlertProvider qui décide quand.
 *
 * On n'utilise pas <Modal /> : sur react-native-web il se positionne en `fixed`
 * par rapport à la fenêtre et déborderait du cadre "téléphone" d'AppShell.
 */
export function AlertModal({
  title,
  message,
  buttons,
  cancelable,
  onDismiss,
  onPress,
}: AlertModalProps) {
  const { t } = useTranslation("common");

  // Sans bouton fourni, `Alert.alert` affiche un simple OK : on fait pareil,
  // sinon la modale n'offrirait aucune sortie.
  const actions: AlertButton[] = buttons.length ? buttons : [{ text: t("ok") }];

  // Web : la touche Échap ferme la modale, réflexe attendu au clavier.
  useEffect(() => {
    // `window` n'existe pas sur natif, et une modale verrouillée ne s'échappe pas.
    if (Platform.OS !== "web" || !cancelable) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    window.addEventListener("keydown", onKeyDown);
    // Nettoyage au démontage : sinon l'écouteur survivrait à la modale.
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cancelable, onDismiss]);

  // Android : le retour système ferme la modale quand elle est annulable, et est
  // consommé dans tous les cas — sinon il ferait naviguer l'écran resté derrière.
  // Ce composant n'étant monté que pendant l'affichage, l'écouteur est enregistré
  // après celui de l'écran (useBlockBackNavigation) et passe donc avant lui.
  useEffect(() => {
    // iOS n'a pas de bouton retour, et le web est traité par l'effet précédent.
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (cancelable) onDismiss();
      return true; // true = évènement consommé, la navigation par défaut n'a pas lieu
    });

    return () => subscription.remove();
  }, [cancelable, onDismiss]);

  return (
    <View
      style={styles.overlay}
      accessibilityViewIsModal // iOS : le lecteur d'écran ignore ce qu'il y a dessous
      accessibilityRole="alert"
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={cancelable ? onDismiss : undefined}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {!!message && <Text style={styles.message}>{message}</Text>}

        <View style={actions.length === 2 ? styles.actionsRow : styles.actionsColumn}>
          {actions.map((button, index) => (
            <Pressable
              key={`${button.text ?? "button"}-${index}`}
              onPress={() => onPress(button)}
              accessibilityRole="button"
              // style en fonction : `pressed` donne le retour visuel à l'appui.
              // Un `condition && style` valant false est ignoré par React Native.
              style={({ pressed }) => [
                styles.button, // base : violet plein
                actions.length === 2 && styles.buttonFlex, // en ligne : moitié-moitié
                button.style === "destructive" && styles.buttonDestructive, // rouge
                button.style === "cancel" && styles.buttonCancel, // blanc bordé
                pressed && styles.buttonPressed,
              ]}
            >
              <Text
                style={[
                  styles.buttonText, // blanc, pour les fonds pleins
                  button.style === "cancel" && styles.buttonTextCancel, // texte sombre
                ]}
              >
                {button.text}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Le voile : colle aux 4 bords du parent, c'est-à-dire au cadre d'AppShell.
  overlay: {
    ...StyleSheet.absoluteFill, // position absolue + top/left/right/bottom à 0
    alignItems: "center", // centre la carte horizontalement
    justifyContent: "center", // et verticalement
    padding: Spacing.xl, // marge minimale sur les petits écrans
    backgroundColor: "rgba(31, 58, 86, 0.45)", // bleu nuit translucide
    zIndex: 10000, // au-dessus de tout, barre d'onglets comprise
  },
  // La carte blanche centrée.
  card: {
    width: "100%",
    maxWidth: 400, // ne s'étire pas sur une grande fenêtre
    padding: Spacing.xl,
    borderRadius: Radius["2xl"],
    backgroundColor: Colors.surface,
    gap: Spacing.sm, // espace entre titre, message et bloc de boutons
    ...Shadows.elevated, // ombre portée : la carte flotte au-dessus du voile
  },
  title: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.headlineSm,
    color: Colors.onSurface,
  },
  message: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyLg,
    lineHeight: 22, // interligne aéré : un message d'erreur fait souvent 2-3 lignes
    color: Colors.onSurfaceVariant, // moins contrasté que le titre
  },
  // Disposition à 2 boutons : sur une ligne.
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md, // détache le bloc du message
  },
  // Disposition à 1 ou 3+ boutons : empilés.
  actionsColumn: {
    flexDirection: "column",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  // Style de base d'un bouton, surchargé ensuite selon button.style.
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full, // pilule
    alignItems: "center",
    justifyContent: "center",
    // Bordure transparente dès la base : la variante "cancel" n'a plus qu'à la
    // colorer, sans changer la taille du bouton.
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: Colors.primary,
  },
  buttonFlex: {
    flex: 1, // en ligne : les deux boutons se partagent la largeur à parts égales
  },
  // style: "destructive" -> action dangereuse (quitter, supprimer).
  buttonDestructive: {
    backgroundColor: Colors.error,
  },
  // style: "cancel" -> action neutre, volontairement moins attirante.
  buttonCancel: {
    backgroundColor: Colors.surface,
    borderColor: Colors.outlineVariant,
  },
  buttonPressed: {
    opacity: 0.8, // retour visuel pendant l'appui
  },
  buttonText: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.titleMd,
    color: Colors.onPrimary, // blanc : lisible sur violet et sur rouge
  },
  buttonTextCancel: {
    color: Colors.onSurface, // le bouton "cancel" a un fond blanc
  },
});
