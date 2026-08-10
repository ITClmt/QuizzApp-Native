/** Repli quand le slug est absent ou inconnu — aligné sur le défaut en base */
export const DEFAULT_AVATAR_SLUG = "yellow-cyclops";

export const AVATARS: Record<string, any> = {
  // Gratuits : disponibles pour tout le monde, sans condition
  "blue-blob": require("../assets/images/profile_pics/free/blue-blob.png"),
  "blue-bunny": require("../assets/images/profile_pics/free/blue-bunny.png"),
  "blue-cyclops": require("../assets/images/profile_pics/free/blue-cyclops.png"),
  "blue-fuzzy": require("../assets/images/profile_pics/free/blue-fuzzy.png"),
  "brown-cyclops": require("../assets/images/profile_pics/free/brown-cyclops.png"),
  "crimson-monster": require("../assets/images/profile_pics/free/crimson-monster.png"),
  "green-furry": require("../assets/images/profile_pics/free/green-furry.png"),
  "green-horned": require("../assets/images/profile_pics/free/green-horned.png"),
  "green-spotted": require("../assets/images/profile_pics/free/green-spotted.png"),
  "orange-bat": require("../assets/images/profile_pics/free/orange-bat.png"),
  "pink-horned": require("../assets/images/profile_pics/free/pink-horned.png"),
  "pink-star-eyes": require("../assets/images/profile_pics/free/pink-star-eyes.png"),
  "purple-blob": require("../assets/images/profile_pics/free/purple-blob.png"),
  "purple-bunny": require("../assets/images/profile_pics/free/purple-bunny.png"),
  "purple-worm": require("../assets/images/profile_pics/free/purple-worm.png"),
  "red-devil": require("../assets/images/profile_pics/free/red-devil.png"),
  "red-flame": require("../assets/images/profile_pics/free/red-flame.png"),
  "red-tail-devil": require("../assets/images/profile_pics/free/red-tail-devil.png"),
  "teal-four-arms": require("../assets/images/profile_pics/free/teal-four-arms.png"),
  "teal-sprout": require("../assets/images/profile_pics/free/teal-sprout.png"),
  "water-drop": require("../assets/images/profile_pics/free/water-drop.png"),
  "yellow-chick": require("../assets/images/profile_pics/free/yellow-chick.png"),
  "yellow-cyclops": require("../assets/images/profile_pics/free/yellow-cyclops.png"),

  // Debloquables par niveau — voir src/users/constants/avatars.ts cote back
  "amber-cyclops": require("../assets/images/profile_pics/unlockable/amber-cyclops.png"),
  "blue-flame": require("../assets/images/profile_pics/unlockable/blue-flame.png"),
  "blue-sprout": require("../assets/images/profile_pics/unlockable/blue-sprout.png"),
  "copper-robot": require("../assets/images/profile_pics/unlockable/copper-robot.png"),
  "crystal-golem": require("../assets/images/profile_pics/unlockable/crystal-golem.png"),
  "ember-triclops": require("../assets/images/profile_pics/unlockable/ember-triclops.png"),
  "emerald-sparkle": require("../assets/images/profile_pics/unlockable/emerald-sparkle.png"),
  "gold-blob": require("../assets/images/profile_pics/unlockable/gold-blob.png"),
  "honey-bunny": require("../assets/images/profile_pics/unlockable/honey-bunny.png"),
  "honey-monster": require("../assets/images/profile_pics/unlockable/honey-monster.png"),
  "jade-triclops": require("../assets/images/profile_pics/unlockable/jade-triclops.png"),
  "leaf-sprite": require("../assets/images/profile_pics/unlockable/leaf-sprite.png"),
  "mint-devil": require("../assets/images/profile_pics/unlockable/mint-devil.png"),
  "monster-king": require("../assets/images/profile_pics/unlockable/monster-king.png"),
  "moss-monster": require("../assets/images/profile_pics/unlockable/moss-monster.png"),
  "opal-ghost": require("../assets/images/profile_pics/unlockable/opal-ghost.png"),
  phoenix: require("../assets/images/profile_pics/unlockable/phoenix.png"),
  "rune-golem": require("../assets/images/profile_pics/unlockable/rune-golem.png"),
  "smoke-ghost": require("../assets/images/profile_pics/unlockable/smoke-ghost.png"),
  "sparkle-cyclops": require("../assets/images/profile_pics/unlockable/sparkle-cyclops.png"),
  "stardust-puff": require("../assets/images/profile_pics/unlockable/stardust-puff.png"),
  "starry-cyclops": require("../assets/images/profile_pics/unlockable/starry-cyclops.png"),
  "steam-robot": require("../assets/images/profile_pics/unlockable/steam-robot.png"),
  "storm-monster": require("../assets/images/profile_pics/unlockable/storm-monster.png"),

  // Speciaux
  Epic_Spacey: require("../assets/images/profile_pics/special/Epic_Spacey.png"),
};

/**
 * Fonction utilitaire pour récupérer une image de profil de façon sûre.
 * @param slug Le slug (nom) de l'avatar enregistré en BDD
 * @returns La ressource image (ou celle par défaut si non trouvée)
 */
export const getAvatarImage = (slug?: string | null) => {
  if (!slug || !AVATARS[slug]) {
    return AVATARS[DEFAULT_AVATAR_SLUG];
  }
  return AVATARS[slug];
};
