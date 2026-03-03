import { useTranslation, Trans } from 'react-i18next';
import styles from './about.module.css';

// You can move this data to a separate JSON file later (e.g., in src/shared/data/)
const AUTHOR_DATA = {
  name: "Daniel Horia",
  role: "Comic Book Artist / Illustrator",
  bioKey: "bio", // key in translation file
  profileImage: "https://nqaibtucwzlxbnelvcjg.supabase.co/storage/v1/object/public/images/danie_horia_portrait.jpg",
  skills: ["Illustration", "Comic Art", "Character Design", "Storyboarding"],
  experience: [
    { titleKey: "exp1.title", year: "2023 - Present" },
    { titleKey: "exp2.title", year: "2018 - 2023" }
  ]
};

function AboutPage() {
  const { t } = useTranslation();

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <img src={AUTHOR_DATA.profileImage} alt={AUTHOR_DATA.name} className={styles.profileImg} />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{AUTHOR_DATA.name}</h1>
          <h2 className={styles.role}>{AUTHOR_DATA.role}</h2>

          <div className={styles.bio}>
            {/* Using Trans to allow HTML tags like <br> in translation files if needed */}
            <p><Trans i18nKey={`about.${AUTHOR_DATA.bioKey}`} t={t}>{t('about.bio.placeholder', { defaultValue: 'Passionate comic book artist...' })}</Trans></p>
          </div>

          <div className={styles.skillsSection}>
            <h3>{t('about.skills.title', { defaultValue: 'Skills' })}</h3>
            <ul className={styles.skillsList}>
              {AUTHOR_DATA.skills.map(skill => (
                <li key={skill} className={styles.skillItem}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className={styles.downloadSection}>
            <a
              href="/Daniel_Horia_Portfolio.pdf"
              download
              className={styles.downloadBtn}
              aria-label={t('about.download.aria', { defaultValue: 'Download PDF Portfolio' })}
            >
              <svg xmlns="http://www.w3.org/Form/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {t('about.download.label', { defaultValue: 'Download PDF Portfolio' })}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPage;
