import { useTranslation } from "react-i18next";
import styles from "./language.module.css";
import { Lang, LANGS } from "@/shared/types/globalTypes"
import { ToggleGroupRoot, ToggleGroupItem } from "../toggle-group/ToogleGroup";
export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  function toLang(input: string): Lang {
    const base = input.toLowerCase().split("-")[0]; // "es-ES" -> "es"
    return base === "en" ? "en" : "es"; // fallback a "es"
  }

  function setLang(lng: "es" | "en") {
    i18n.changeLanguage(lng);
  };

  return (
    <ToggleGroupRoot
      className={styles.Group}
      type="single"
      size="sm"
      onValueChange={(e: Lang) => { setLang(e) }}
      defaultValue={toLang(i18n.language)} >
      {LANGS.map((lang: Lang) => (
        <ToggleGroupItem
          key={lang}
          value={lang}
          disabled={toLang(i18n.language) === lang}
        >
          {lang.toUpperCase()}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot >
  );
}
