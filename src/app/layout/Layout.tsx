import { Outlet, NavLink } from "react-router-dom";
import styles from "./layout.module.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/ui/language-switcher/LanguageSwitcher";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

export default function AppLayout() {
  const { t } = useTranslation("common");

  return (
    <div className={styles.shell}>
      {/* <a className={styles.skipLink} href="#main">
        Skip to content
      </a> */}

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              ◼
            </span>
            <span className={styles.brandText}>{t("global.name")}</span>
          </NavLink>

          <nav className={styles.nav} aria-label="Primary">
            <NavLink to="/projects" className={navLinkClassName}>
              {t("nav.projects")}
            </NavLink>
            <NavLink to="/canvas" className={navLinkClassName}>
              {t("nav.canvas")}
            </NavLink>
            <NavLink to="/about" className={navLinkClassName}>
              {t("nav.about")}
            </NavLink>
            <NavLink to="/contact" className={navLinkClassName}>
              {t("nav.contact")}
            </NavLink>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      <main id="main" className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} Francesc Destruels Rossello. {t("footer.built")}
          </p>

          <ul className={styles.footerLinks} aria-label="Social links">
            <li>
              <a
                className={styles.footerLink}
                href="https://github.com/tu-usuario"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                className={styles.footerLink}
                href="https://www.linkedin.com/in/tu-perfil"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}