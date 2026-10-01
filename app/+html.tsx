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
 */
const APP_BACKGROUND = "#EAF7FD";
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
        <meta name="theme-color" content={APP_BACKGROUND} />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: rootStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
