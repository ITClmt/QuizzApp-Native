interface CategoryLabel {
  id: string;
  /** Value of Question.category sent by the API (the back's QUIZ_CATEGORIES name) */
  name: string;
  en: string;
  fr: string;
}

const CATEGORY_LABELS: CategoryLabel[] = [
  { id: "9", name: "General Knowledge", en: "General Knowledge", fr: "Culture générale" },
  { id: "11", name: "Film", en: "Film", fr: "Cinéma" },
  { id: "12", name: "Music", en: "Music", fr: "Musique" },
  { id: "15", name: "Video Games", en: "Video Games", fr: "Jeux vidéo" },
  { id: "22", name: "Geography", en: "Geography", fr: "Géographie" },
  { id: "21", name: "Sports", en: "Sports", fr: "Sport" },
  { id: "23", name: "History", en: "History", fr: "Histoire" },
  { id: "27", name: "Animals", en: "Animals", fr: "Animaux" },
  { id: "17", name: "Science & Nature", en: "Science & Nature", fr: "Sciences et nature" },
  { id: "14", name: "Television", en: "Television", fr: "Télévision" },
  { id: "26", name: "Celebrities", en: "Celebrities", fr: "Célébrités" },
  { id: "20", name: "Mythology", en: "Mythology", fr: "Mythologie" },
  { id: "25", name: "Art", en: "Art", fr: "Art" },
  { id: "28", name: "Vehicles", en: "Vehicles", fr: "Véhicules" },
  { id: "10", name: "Books", en: "Books", fr: "Livres" },
  { id: "18", name: "Computers", en: "Computers", fr: "Informatique" },
  { id: "29", name: "Comics", en: "Comics", fr: "Comics" },
  {
    id: "32",
    name: "Cartoon & Animations",
    en: "Cartoon & Animations",
    fr: "Dessins animés",
  },
  {
    id: "31",
    name: "Japanese Anime & Manga",
    en: "Japanese Anime & Manga",
    fr: "Anime et manga japonais",
  },
  { id: "16", name: "Board Games", en: "Board Games", fr: "Jeux de société" },
  { id: "24", name: "Politics", en: "Politics", fr: "Politique" },
  { id: "19", name: "Mathematics", en: "Mathematics", fr: "Mathématiques" },
  {
    id: "13",
    name: "Musicals & Theatres",
    en: "Musicals & Theatres",
    fr: "Comédies musicales et théâtre",
  },
  { id: "30", name: "Gadgets", en: "Gadgets", fr: "Gadgets" },
];

const BY_ID = new Map(CATEGORY_LABELS.map((c) => [c.id, c]));
const BY_NAME = new Map(CATEGORY_LABELS.map((c) => [c.name, c]));

export function getCategoryLabelById(id: string, lang: string): string {
  const entry = BY_ID.get(id);
  if (!entry) return id;
  return lang === "fr" ? entry.fr : entry.en;
}

export function getCategoryLabelByName(name: string, lang: string): string {
  const entry = BY_NAME.get(name);
  if (!entry) return name;
  return lang === "fr" ? entry.fr : entry.en;
}
