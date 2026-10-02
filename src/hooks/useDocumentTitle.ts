import { usePathname } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

const APP_NAME = "QuizzApp";

/** Premier segment d'URL → clé `common:pageTitles.*`. */
const TITLE_KEY_BY_SEGMENT = {
  "": "home",
  leaderboard: "leaderboard",
  profile: "profile",
  settings: "settings",
  avatars: "avatars",
  history: "history",
  friends: "friends",
  login: "login",
  register: "register",
  preQuiz: "quiz",
  quiz: "quiz",
  results: "results",
  create: "newGame",
  lobby: "lobby",
  game: "game",
} as const;

/**
 * Titre de l'onglet du navigateur (web uniquement).
 *
 * expo-router désactive la gestion du `document.title` par React Navigation,
 * donc sans ce hook l'onglet affiche l'URL brute. Centralisé ici plutôt qu'un
 * <Head> par écran : une nouvelle route n'a qu'à s'ajouter à la table.
 */
export function useDocumentTitle() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const segment = pathname.split("/")[1] ?? "";
    const key =
      TITLE_KEY_BY_SEGMENT[segment as keyof typeof TITLE_KEY_BY_SEGMENT];
    document.title = key ? `${t(`pageTitles.${key}`)} · ${APP_NAME}` : APP_NAME;
  }, [pathname, t, i18n.language]);
}
