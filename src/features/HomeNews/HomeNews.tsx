import * as React from "react";
import { useTranslation } from "react-i18next";
import styles from "./homeNews.module.css";
import { Button } from "@/shared/ui/button/Button";

type NewsItem = {
    id: string;
    image_src?: string | null;
    title: Record<string, string>;
    text: Record<string, string>;
    url?: string | null;
    text_url?: Record<string, string> | null;
    created_at: string;
};

type Props = {
    news: NewsItem[];
};

export function HomeNews({ news }: Props) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language as "en" | "es" | "fr" | "ro";

    if (!news || news.length === 0) return null;

    return (
        <div className={styles.newsContainer}>
            {news.map((item) => {
                const title = item.title?.[currentLang] || item.title?.["en"] || "";
                const text = item.text?.[currentLang] || item.text?.["en"] || "";
                const btnText = item.text_url?.[currentLang] || item.text_url?.["en"] || "";

                // Formatear la fecha (opcional, le da un toque editorial)
                const dateObj = new Date(item.created_at);
                const formattedDate = new Intl.DateTimeFormat(currentLang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).format(dateObj);

                return (
                    <article key={item.id} className={styles.newsCard}>
                        {item.image_src && (
                            <div className={styles.imageWrapper}>
                                <img src={item.image_src} alt={title} className={styles.image} />
                            </div>
                        )}

                        <div className={styles.content}>
                            <span className={styles.date}>{formattedDate}</span>
                            <h3 className={styles.title}>{title}</h3>
                            <p className={styles.text}>{text}</p>

                            {item.url && btnText && (
                                <div className={styles.action}>
                                    <Button asChild variant="ghost">
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                            {btnText}
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
