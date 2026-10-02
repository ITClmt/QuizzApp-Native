import { i18n } from "@/src/i18n";

/** Code d'erreur renvoyé dans l'ack du socket → message traduit */
export function getSocketErrorMessage(code: string): string {
  return i18n.exists(`errors:${code}`)
    ? i18n.t(`errors:${code}`)
    : i18n.t("errors:INTERNAL_ERROR");
}
