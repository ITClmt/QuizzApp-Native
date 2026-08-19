import { AlertModal } from "@/src/components/AlertModal";
import { createContext, useCallback, useContext, useState } from "react";
// AlertButton / AlertOptions : on réutilise les types de React Native pour que
// showAlert ait exactement la signature de Alert.alert (rien à réapprendre).
import { Keyboard, type AlertButton, type AlertOptions } from "react-native";

// --- Types ---

/** Ce que le contexte expose aux écrans. Une seule fonction : showAlert. */
type AlertContextType = {
  /**
   * Même signature que `Alert.alert` de React Native :
   * `showAlert(titre, message?, boutons?, options?)`.
   */
  showAlert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions,
  ) => void;
};

/** L'alerte affichée. `null` = aucune, donc aucune modale rendue. */
type AlertRequest = {
  title: string;
  message?: string;
  /** Toujours un tableau ici (jamais undefined) pour simplifier l'affichage. */
  buttons: AlertButton[];
  options?: AlertOptions;
};

// Valeur par défaut `null` : ça permet à useAlert() de détecter qu'on est en
// dehors du provider et de lever une erreur claire plutôt que de planter plus loin.
const AlertContext = createContext<AlertContextType | null>(null);

/**
 * Confirmations et messages d'erreur de l'appli, sur toutes les plateformes.
 *
 * Remplace `Alert.alert` de React Native, qui n'est pas implémenté par
 * react-native-web : sur le navigateur l'appel partait dans le vide et toute
 * confirmation (abandon de quiz, changement de langue…) devenait un cul-de-sac
 * silencieux. Plutôt que de brancher sur `Platform.OS`, on affiche partout la
 * même modale maison : une seule apparence, un seul chemin de code à tester.
 *
 * Monté dans Providers, à l'intérieur d'AppShell, pour que la modale se
 * superpose au cadre "téléphone" et pas à toute la fenêtre du navigateur.
 */
export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<AlertRequest | null>(null);

  /** Affiche une alerte. C'est ce que les écrans récupèrent via useAlert(). */
  const showAlert = useCallback(
    (
      title: string,
      message?: string,
      buttons?: AlertButton[],
      options?: AlertOptions,
    ) => {
      // L'Alert système fermait le clavier ; la modale n'est qu'un calque, donc
      // on s'en charge — sinon le clavier reste ouvert par-dessus après un submit.
      Keyboard.dismiss();

      setCurrent({
        title,
        message,
        buttons: buttons ?? [], // pas de boutons fournis → tableau vide
        options,
      });
    },
    [], // aucune dépendance : showAlert garde la même identité pour toujours, donc
    //     les useEffect/useCallback des écrans qui en dépendent ne rejouent pas
  );

  /** Ferme la modale : plus d'alerte, plus rien de rendu. */
  const close = useCallback(() => setCurrent(null), []);

  // Fermeture sans choix (appui sur le fond, Échap, retour Android) : aucun
  // onPress n'est déclenché, seul `onDismiss` est notifié — comportement d'un
  // dismiss Android.
  const handleDismiss = useCallback(() => {
    close();
    // `?.` en cascade : options peut être absent, onDismiss aussi.
    current?.options?.onDismiss?.();
  }, [close, current]); // `current` en dépendance : c'est SON onDismiss qu'on appelle

  // Appui sur un bouton. On ferme AVANT d'exécuter le onPress : si celui-ci
  // rouvre une alerte, c'est bien la nouvelle qui doit rester affichée.
  const handlePress = useCallback(
    (button: AlertButton) => {
      close();
      button.onPress?.(); // un bouton peut n'avoir aucune action (simple "OK")
    },
    [close],
  );

  return (
    // value = ce que useAlert() renverra dans tous les composants en dessous.
    <AlertContext.Provider value={{ showAlert }}>
      {/* Toute l'appli. Elle est rendue avant la modale, donc la modale passe
          par-dessus dans l'ordre de peinture. */}
      {children}

      {/* Pas d'alerte → rien n'est rendu. C'est tout le mécanisme "s'affiche et
          repart" : la modale n'existe que tant que current existe. */}
      {current && (
        <AlertModal
          title={current.title}
          message={current.message}
          buttons={current.buttons}
          // Annulable par défaut, comme Alert.alert : seul un `cancelable: false`
          // explicite verrouille la modale.
          cancelable={current.options?.cancelable !== false}
          onDismiss={handleDismiss}
          onPress={handlePress}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }

  return context;
}
