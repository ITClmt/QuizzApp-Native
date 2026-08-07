interface CategoryLabel {
  id: string;
  otdName: string;
  en: string;
  fr: string;
}

const CATEGORY_LABELS: CategoryLabel[] = [
  { id: "9", otdName: "General Knowledge", en: "General Knowledge", fr: "Culture générale" },
  { id: "11", otdName: "Entertainment: Film", en: "Film", fr: "Cinéma" },
  { id: "12", otdName: "Entertainment: Music", en: "Music", fr: "Musique" },
  { id: "15", otdName: "Entertainment: Video Games", en: "Video Games", fr: "Jeux vidéo" },
  { id: "22", otdName: "Geography", en: "Geography", fr: "Géographie" },
  { id: "21", otdName: "Sports", en: "Sports", fr: "Sport" },
  { id: "23", otdName: "History", en: "History", fr: "Histoire" },
  { id: "27", otdName: "Animals", en: "Animals", fr: "Animaux" },
  { id: "17", otdName: "Science & Nature", en: "Science & Nature", fr: "Sciences et nature" },
  { id: "14", otdName: "Entertainment: Television", en: "Television", fr: "Télévision" },
  { id: "26", otdName: "Celebrities", en: "Celebrities", fr: "Célébrités" },
  { id: "20", otdName: "Mythology", en: "Mythology", fr: "Mythologie" },
  { id: "25", otdName: "Art", en: "Art", fr: "Art" },
  { id: "28", otdName: "Vehicles", en: "Vehicles", fr: "Véhicules" },
  { id: "10", otdName: "Entertainment: Books", en: "Books", fr: "Livres" },
  { id: "18", otdName: "Science: Computers", en: "Computers", fr: "Informatique" },
  { id: "29", otdName: "Entertainment: Comics", en: "Comics", fr: "Comics" },
  {
    id: "32",
    otdName: "Entertainment: Cartoon & Animations",
    en: "Cartoon & Animations",
    fr: "Dessins animés",
  },
  {
    id: "31",
    otdName: "Entertainment: Japanese Anime & Manga",
    en: "Japanese Anime & Manga",
    fr: "Anime et manga japonais",
  },
  { id: "16", otdName: "Entertainment: Board Games", en: "Board Games", fr: "Jeux de société" },
  { id: "24", otdName: "Politics", en: "Politics", fr: "Politique" },
  { id: "19", otdName: "Science: Mathematics", en: "Mathematics", fr: "Mathématiques" },
  {
    id: "13",
    otdName: "Entertainment: Musicals & Theatres",
    en: "Musicals & Theatres",
    fr: "Comédies musicales et théâtre",
  },
  { id: "30", otdName: "Science: Gadgets", en: "Gadgets", fr: "Gadgets" },
];

const BY_ID = new Map(CATEGORY_LABELS.map((c) => [c.id, c]));
const BY_OTD_NAME = new Map(CATEGORY_LABELS.map((c) => [c.otdName, c]));

export function getCategoryLabelById(id: string, lang: string): string {
  const entry = BY_ID.get(id);
  if (!entry) return id;
  return lang === "fr" ? entry.fr : entry.en;
}

export function getCategoryLabelByOtdName(otdName: string, lang: string): string {
  const entry = BY_OTD_NAME.get(otdName);
  if (!entry) return otdName;
  return lang === "fr" ? entry.fr : entry.en;
}
