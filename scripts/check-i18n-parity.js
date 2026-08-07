// Vérifie que chaque namespace de src/i18n/locales/fr a exactement les
// mêmes clés (récursivement) que son équivalent dans locales/en, pour éviter
// les trous de traduction silencieux (clé absente => i18next affiche la clé
// brute au lieu du texte).
const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "src", "i18n", "locales");
const BASE_LANG = "fr";
const OTHER_LANG = "en";

function flattenKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return flattenKeys(value, fullKey);
    }
    return [fullKey];
  });
}

function loadNamespace(lang, filename) {
  const filePath = path.join(LOCALES_DIR, lang, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function main() {
  const baseDir = path.join(LOCALES_DIR, BASE_LANG);
  const namespaces = fs.readdirSync(baseDir).filter((f) => f.endsWith(".json"));

  let hasMismatch = false;

  for (const filename of namespaces) {
    const baseKeys = new Set(flattenKeys(loadNamespace(BASE_LANG, filename)));
    let otherKeys;
    try {
      otherKeys = new Set(flattenKeys(loadNamespace(OTHER_LANG, filename)));
    } catch {
      console.error(`✗ ${filename}: missing in "${OTHER_LANG}" locale`);
      hasMismatch = true;
      continue;
    }

    const missingInOther = [...baseKeys].filter((k) => !otherKeys.has(k));
    const missingInBase = [...otherKeys].filter((k) => !baseKeys.has(k));

    if (missingInOther.length > 0 || missingInBase.length > 0) {
      hasMismatch = true;
      console.error(`✗ ${filename}`);
      for (const key of missingInOther) {
        console.error(`    missing in "${OTHER_LANG}": ${key}`);
      }
      for (const key of missingInBase) {
        console.error(`    missing in "${BASE_LANG}": ${key}`);
      }
    }
  }

  if (hasMismatch) {
    console.error("\ni18n key parity check failed.");
    process.exit(1);
  }

  console.log(`✓ ${namespaces.length} i18n namespace(s) in sync between fr/en.`);
}

main();
