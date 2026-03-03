import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import transES from "./locales/es/translation.json";
import transEN from "./locales/en/translation.json";
import transFR from "./locales/fr/translation.json";
import transRO from "./locales/ro/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    supportedLngs: ["es", "en", "fr", "ro"],
    ns: ["translation"],
    defaultNS: "translation",
    resources: {
      es: { translation: transES },
      en: { translation: transEN },
      fr: { translation: transFR },
      ro: { translation: transRO },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;