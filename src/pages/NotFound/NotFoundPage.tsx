// src/pages/NotFound/NotFoundPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import styles from "./notfound.module.css";
import SEO from "@/shared/ui/seo/SEO";

export default function NotFoundPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [secondsLeft, setSecondsLeft] = useState(5);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setSecondsLeft((s) => Math.max(0, s - 1));
        }, 1000);

        const timeoutId = window.setTimeout(() => {
            navigate("/", { replace: true });
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
            window.clearTimeout(timeoutId);
        };
    }, [navigate]);

    return (
        <section className={styles.page}>
            <SEO title="404" description="Page not found" />
            <div className={styles.imageContainer}>
                <img
                    src="https://images.unsplash.com/photo-1541011504997-60e5baaa0a01?q=80&w=800"
                    alt="Confused character looking around"
                    className={styles.image}
                />
            </div>
            <h1 className={styles.title}>{t("common.notFound.title")}</h1>
            <p className={styles.description}>{t("common.notFound.description")}</p>
            <p className={styles.redirecting}>
                <Trans i18nKey="common.notFound.redirecting" t={t} values={{ seconds: secondsLeft }}>
                    Redirecting in <strong>{secondsLeft}</strong>s.
                </Trans>
            </p>

            <Link to="/" className={styles.button}>
                {t("common.notFound.button")}
            </Link>
        </section>
    );
}
