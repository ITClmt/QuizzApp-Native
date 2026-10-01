import { Platform } from "react-native";

/** Doit correspondre à l'id et à la durée de transition posés dans app/+html.tsx. */
const SPLASH_ID = "boot-splash";
const FADE_MS = 200;

/**
 * Retire l'écran de démarrage du web (le pendant d'expo-splash-screen, qui n'a
 * aucun effet sur navigateur). Il est en HTML statique dans +html.tsx pour
 * s'afficher avant même le chargement du JavaScript.
 */
export function hideWebSplash() {
  if (Platform.OS !== "web") return;

  const splash = document.getElementById(SPLASH_ID);
  if (!splash) return;

  splash.classList.add("is-hidden");
  // Minuterie plutôt que `transitionend` : ce dernier ne part pas si l'onglet
  // est en arrière-plan, et l'écran resterait dans le DOM.
  setTimeout(() => splash.remove(), FADE_MS);
}
