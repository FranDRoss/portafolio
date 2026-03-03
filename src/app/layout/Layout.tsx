// src/app/layout/AppLayout.tsx
import { Outlet, NavLink, useLocation } from "react-router-dom";
import styles from "./layout.module.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/ui/language-switcher/LanguageSwitcher";
import SEO from "@/shared/ui/seo/SEO";

import * as Dialog from "@radix-ui/react-dialog";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

export default function AppLayout() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { to: "/about", label: t("common.nav.about") },
    { to: "/gallery", label: t("common.nav.gallery"), hideOnMobile: true },
    { to: "/projects", label: t("common.nav.projects") },
    { to: "/contact", label: t("common.nav.contact") },
  ];

  return (
    <div className={styles.shell}>
      <SEO />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              {/* Recomendado: mueve la imagen a /public y usa /images/... */}
              <img
                src="/images/horia-daniel-big_circle.webp"
                alt="Logo"
                width={40}
                height={40}
                className={styles.brandImg}
              />
            </span>
            <span className={styles.brandText}>{t("common.global.name")}</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Primary">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Acciones desktop (idioma) */}
          <div className={styles.actions}>
            <LanguageSwitcher />
          </div>

          {/* Mobile: Burger + Radix Dialog */}
          <div className={styles.mobileOnly}>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className={styles.burgerButton}
                  aria-label={t("common.a11y.openMenu", { defaultValue: "Open menu" })}
                >
                  <span className={styles.burgerIcon} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className={styles.mobileOverlay} />
                <Dialog.Content className={styles.mobileSheet}>
                  <div className={styles.mobileHeader}>
                    <Dialog.Title className={styles.mobileTitle}>
                      {t("common.global.name")}
                    </Dialog.Title>

                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className={styles.closeButton}
                        aria-label={t("common.a11y.closeMenu", { defaultValue: "Close menu" })}
                      >
                        ×
                      </button>
                    </Dialog.Close>
                  </div>

                  <nav className={styles.mobileNav} aria-label="Mobile primary">
                    {navItems.filter(item => !item.hideOnMobile).map((item) => {
                      const isActive = location.pathname.startsWith(item.to);
                      return (
                        <Dialog.Close asChild key={item.to}>
                          <NavLink
                            to={item.to}
                            className={
                              isActive
                                ? `${styles.mobileLink} ${styles.mobileLinkActive}`
                                : styles.mobileLink
                            }
                          >
                            {item.label}
                          </NavLink>
                        </Dialog.Close>
                      );
                    })}
                  </nav>

                  <div className={styles.mobileActions}>
                    <LanguageSwitcher />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>

      <main id="main" className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} {t("common.footer.developedBy")}{" "}
            <a
              className={styles.footerLink}
              href="https://www.linkedin.com/in/frandross/"
              rel="noreferrer"
              aria-label="Francesc Destruels Rossello LinkedIn"
              target="_blank"
            >
              Francesc Destruels Rossello
            </a>{" "}
            {t("common.footer.builtWith")}
          </p>

          <ul className={styles.footerLinks} aria-label="Social links">
            <li>
              <a
                className={styles.footerLink}
                href="https://www.linkedin.com/in/daniel-horia"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                className={styles.footerLink}
                href="https://www.artstation.com/soarecucolti"
                target="_blank"
                rel="noreferrer"
              >
                ArtStation
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
