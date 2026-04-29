export const AVATARS: Record<string, any> = {
  default: require("../assets/images/profile_pics/default.png"),
  Epic_Spacey: require("../assets/images/profile_pics/special/Epic_Spacey.png"),
};

/**
 * Fonction utilitaire pour récupérer une image de profil de façon sûre.
 * @param slug Le slug (nom) de l'avatar enregistré en BDD
 * @returns La ressource image (ou celle par défaut si non trouvée)
 */
export const getAvatarImage = (slug?: string | null) => {
  if (!slug || !AVATARS[slug]) {
    return AVATARS["default"];
  }
  return AVATARS[slug];
};
