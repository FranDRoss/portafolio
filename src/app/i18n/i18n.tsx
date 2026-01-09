import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonES from "./locales/es/common.json";
import homeES from "./locales/es/home.json";
import aboutES from "./locales/es/about.json";
import projectsES from "./locales/es/projects.json";
import commonEN from "./locales/en/common.json";
import homeEN from "./locales/en/home.json";
import aboutEN from "./locales/en/home.json";
import projectsEN from "./locales/en/projects.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    ns: ["common", "home"],
    defaultNS: "common",
    resources: {
      es: { common: commonES, home: homeES, about: aboutES, projects: projectsES },
      en: { common: commonEN, home: homeEN, about: aboutEN, projects: projectsEN },
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