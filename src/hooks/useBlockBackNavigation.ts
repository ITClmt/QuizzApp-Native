import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

/**
 * Empêche de quitter l'écran par un retour arrière implicite :
 * - iOS : le swipe depuis le bord gauche
 * - Android : le bouton / geste système "back"
 *
 */
export function useBlockBackNavigation() {
  const navigation = useNavigation();

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ gestureEnabled: false });

    return () => {
      parent?.setOptions({ gestureEnabled: true });
    };
  }, [navigation]);

  useEffect(() => {
    // Retourner true = évènement consommé, la navigation par défaut n'a pas lieu.
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    return () => subscription.remove();
  }, []);
}
