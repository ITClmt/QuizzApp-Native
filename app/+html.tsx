import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

/**
 * Document HTML de la version web (statique). Il n'est jamais rendu sur natif.
 *
 * Il reprend le document par défaut d'expo-router en corrigeant deux détails
 * qui se voient uniquement sur un navigateur mobile :
 * - `100%` se calcule sur le viewport barre d'URL rétractée, donc l'appli
 *   dépassait de l'écran et la page devenait scrollable ; `100dvh` suit la
 *   hauteur réellement visible.
 * - le rebond / "pull to refresh" pouvait décoller toute l'interface.
 *
 * Il déclare aussi la PWA (public/manifest.json) : une fois ajoutée à l'écran
 * d'accueil, l'appli s'ouvre sans barre d'URL, comme une appli native.
 */
const APP_NAME = "QuizzApp";
const APP_DESCRIPTION =
  "Quiz en tout genre : joue en solo, grimpe au classement et défie tes amis.";
/** Les aperçus de lien (Open Graph) exigent une URL absolue pour l'image. */
const SITE_URL = "https://itclmt-quizzapp.expo.app";
const APP_BACKGROUND = "#EAF7FD";
/** Haut du dégradé = fond de la navbar : la barre d'état s'y raccorde. */
const THEME_COLOR = "#BFE6FA";
/** Encre de l'appli (#1F3A56) adoucie : la barre grise native jurait dans le cadre. */
const SCROLLBAR_THUMB = "rgba(31, 58, 86, 0.25)";

const rootStyles = `
html, body, #root {
  height: 100%;
  height: 100dvh;
}
body {
  background-color: ${APP_BACKGROUND};
  overscroll-behavior: none;
}
* {
  scrollbar-width: thin;
  scrollbar-color: ${SCROLLBAR_THUMB} transparent;
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* viewport-fit=cover : sans ça les encoches iOS ne remontent aucune
            safe area au web, et la barre de nav passe sous l'indicateur. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="theme-color" content={THEME_COLOR} />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        {/* "default" : barre d'état opaque. "black-translucent" mettrait du
            texte blanc par-dessus le ciel clair, illisible. */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Aperçu quand le lien est partagé (Messenger, WhatsApp, Discord…) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:title" content={APP_NAME} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/icons/icon-512.png`} />
        <meta property="og:locale" content="fr_FR" />
        <meta name="twitter:card" content="summary" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: rootStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
