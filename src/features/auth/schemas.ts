import type { TFunction } from "i18next";
import { z } from "zod";

// Les messages dépendent de la langue active : on construit le schéma via
// une factory appelée depuis le composant (useMemo sur i18n.language) plutôt
// que de figer des messages statiques au chargement du module.
export function makeLoginSchema(t: TFunction<"auth">) {
  return z.object({
    email: z.string().email(t("validation.invalidEmail")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });
}

export function makeRegisterSchema(t: TFunction<"auth">) {
  return z
    .object({
      username: z
        .string()
        .min(3, t("validation.usernameMin"))
        .max(20, t("validation.usernameMax")),
      email: z.email(t("validation.invalidEmail")),
      password: z.string().min(8, t("validation.passwordMin")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

export type LoginFormValues = z.infer<ReturnType<typeof makeLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof makeRegisterSchema>>;
