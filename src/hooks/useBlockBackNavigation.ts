import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { BackHandler } from "react-native";

/**
 * Empêche de quitter l'écran par un retour arrière implicite :
 * - iOS : le swipe depuis le bord gauche
 * - Android : le bouton / geste système "back"
 *
 * `onBackAttempt` est appelé à chaque retour système intercepté : l'écran doit
 * y proposer une vraie sortie (confirmation, abandon…). Sans lui le retour
 * serait un cul-de-sac silencieux, ce que ni iOS ni Android n'admettent.
 */
export function useBlockBackNavigation(onBackAttempt?: () => void) {
  const navigation = useNavigation();

  // Le listener est enregistré une seule fois : on passe par une ref pour que
  // le handler reste à jour sans désabonner/réabonner à chaque rendu.
  const onBackAttemptRef = useRef(onBackAttempt);
  onBackAttemptRef.current = onBackAttempt;

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ gestureEnabled: false });

    return () => {
      parent?.setOptions({ gestureEnabled: true });
    };
  }, [navigation]);

  useEffect(() => {
    // Retourner true = évènement consommé, la navigation par défaut n'a pas lieu.
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      onBackAttemptRef.current?.();
      return true;
    });

    return () => subscription.remove();
  }, []);
}
