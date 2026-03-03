import { useTranslation } from "react-i18next";
import styles from "./language.module.css";
import { Lang, LANGS } from "@/shared/types/globalTypes"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  function toLang(input: string): Lang {
    const base = input.toLowerCase().split("-")[0]; // "es-ES" -> "es"
    return base === "es" ? "es" : base === "fr" ? "fr" : base === "ro" ? "ro" : "en"; // fallback a "en"
  }

  function setLang(lng: Lang) {
    i18n.changeLanguage(lng);
  };

  const currentLang = toLang(i18n.language);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className={styles.triggerButton} aria-label="Change language">
          {currentLang.toUpperCase()}
          <span className={styles.chevron}>▼</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.dropdownContent} sideOffset={5} align="end">
          {LANGS.map((lang: Lang) => (
            <DropdownMenu.Item
              key={lang}
              className={`${styles.dropdownItem} ${currentLang === lang ? styles.dropdownItemActive : ''}`}
              onSelect={() => setLang(lang)}
            >
              {lang.toUpperCase()}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
