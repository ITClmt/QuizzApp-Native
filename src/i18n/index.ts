import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Storage } from "@/src/lib/storage";

import authEn from "./locales/en/auth.json";
import commonEn from "./locales/en/common.json";
import errorsEn from "./locales/en/errors.json";
import homeEn from "./locales/en/home.json";
import leaderboardEn from "./locales/en/leaderboard.json";
import profileEn from "./locales/en/profile.json";
import quizEn from "./locales/en/quiz.json";
import settingsEn from "./locales/en/settings.json";
import authFr from "./locales/fr/auth.json";
import commonFr from "./locales/fr/common.json";
import errorsFr from "./locales/fr/errors.json";
import homeFr from "./locales/fr/home.json";
import leaderboardFr from "./locales/fr/leaderboard.json";
import profileFr from "./locales/fr/profile.json";
import quizFr from "./locales/fr/quiz.json";
import settingsFr from "./locales/fr/settings.json";

export const SUPPORTED_LANGUAGES = ["fr", "en"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = "app_language";

export const resources = {
  fr: {
    common: commonFr,
    auth: authFr,
    home: homeFr,
    quiz: quizFr,
    leaderboard: leaderboardFr,
    profile: profileFr,
    settings: settingsFr,
    errors: errorsFr,
  },
  en: {
    common: commonEn,
    auth: authEn,
    home: homeEn,
    quiz: quizEn,
    leaderboard: leaderboardEn,
    profile: profileEn,
    settings: settingsEn,
    errors: errorsEn,
  },
};

function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return value === "fr" || value === "en";
}

function detectDeviceLanguage(): AppLanguage {
  const locales = Localization.getLocales();
  const isFrench = locales?.some(
    (locale) =>
      locale.languageCode === "fr" || locale.languageTag?.startsWith("fr"),
  );
  return isFrench ? "fr" : "en";
}

async function resolveInitialLanguage(): Promise<AppLanguage> {
  const stored = await Storage.getItemAsync(LANGUAGE_STORAGE_KEY);
  if (isAppLanguage(stored)) return stored;
  return detectDeviceLanguage();
}

// L'appli utilise déjà User.lang côté backend pour choisir la langue des
// questions — on réutilise la même valeur pour piloter l'UI dès qu'un compte
// est connecté (voir AuthContext), et on la persiste pour les sessions déconnectées.
export async function setAppLanguage(lang: AppLanguage): Promise<void> {
  await Storage.setItemAsync(LANGUAGE_STORAGE_KEY, lang);
  if (i18n.language !== lang) await i18n.changeLanguage(lang);
}

export async function initI18n(): Promise<void> {
  const lng = await resolveInitialLanguage();
  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: "fr",
    ns: [
      "common",
      "auth",
      "home",
      "quiz",
      "leaderboard",
      "profile",
      "settings",
      "errors",
    ],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export { i18n };
