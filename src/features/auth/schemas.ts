import type { TFunction } from "i18next";
import { z } from "zod";

// Doit rester alignée avec PASSWORD_REGEX de
// QuizzApp-Back/src/common/validators/is-strong-password.decorator.ts
// pour éviter qu'un mot de passe passe le front puis se fasse rejeter par l'API
// (chaque 400 grignote le rate-limit de /auth/register).
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S+$/;

// Les messages dépendent de la langue active : on construit le schéma via
// une factory appelée à chaque rendu du composant plutôt que de figer des
// messages statiques au chargement du module. Pas de useMemo : le React
// Compiler mémoïse déjà l'appel tant que `t` ne change pas.
export function makeLoginSchema(t: TFunction<"auth">) {
  return z.object({
    email: z.string().email(t("validation.invalidEmail")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });
}

// Règles partagées par l'inscription et la réinitialisation
function makePasswordField(t: TFunction<"auth">) {
  return z
    .string()
    .min(8, t("validation.passwordMin"))
    .max(128, t("validation.passwordMax"))
    .regex(PASSWORD_REGEX, t("validation.passwordComplexity"));
}

export function makeRegisterSchema(t: TFunction<"auth">) {
  return z
    .object({
      username: z
        .string()
        .min(3, t("validation.usernameMin"))
        .max(20, t("validation.usernameMax")),
      email: z.email(t("validation.invalidEmail")),
      password: makePasswordField(t),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

export function makeForgotPasswordSchema(t: TFunction<"auth">) {
  return z.object({
    email: z.email(t("validation.invalidEmail")),
  });
}

export function makeResetPasswordSchema(t: TFunction<"auth">) {
  return z
    .object({
      code: z.string().regex(/^\d{6}$/, t("validation.codeFormat")),
      password: makePasswordField(t),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

export type LoginFormValues = z.infer<ReturnType<typeof makeLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof makeRegisterSchema>>;
export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof makeForgotPasswordSchema>
>;
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof makeResetPasswordSchema>
>;
