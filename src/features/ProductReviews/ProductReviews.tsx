import * as React from "react";
import { useTranslation } from "react-i18next";
import styles from "./productReviews.module.css";
import { supabase } from "@/shared/lib/supabase";

export type Product = {
    pId: string;
};

type ReviewData = {
    id: string;
    title: Record<string, string>;
    author: string;
    source_name: string;
    url: string | null;
    text_content: Record<string, string>;
};

type Props = {
    product: Product;
    accentColor?: string;
};

export default function ProductReviews({
    product,
    accentColor
}: Props) {
    const { i18n } = useTranslation();
    const [reviews, setReviews] = React.useState<ReviewData[]>([]);
    const [loading, setLoading] = React.useState(true);

    const currentLang = i18n.language as "en" | "es" | "fr" | "ro";

    React.useEffect(() => {
        async function fetchReviews() {
            if (!product.pId) {
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from("project_reviews")
                    .select("*")
                    .eq("product_id", product.pId)
                    .eq("active", true)
                    .order("sort_order", { ascending: true });

                if (error) throw error;
                if (data) setReviews(data as ReviewData[]);
            } catch (error) {
                console.error("Error fetching project reviews:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [product.pId]);

    if (loading || !reviews.length) return null;

    return (
        <section
            className={styles.root}
            style={
                accentColor
                    ? ({ "--accent-color": accentColor } as React.CSSProperties)
                    : undefined
            }
            aria-label="Product reviews"
        >
            <div className={styles.content}>
                {reviews.map((r) => {
                    const localTitle = r.title?.[currentLang] || r.title?.["en"] || "";
                    const localContent = r.text_content?.[currentLang] || r.text_content?.["en"] || "";

                    return (
                        <div key={r.id} className={styles.reviewRow}>
                            <article className={styles.reviewBubble}>
                                <p className={styles.reviewTitle}>
                                    {localTitle}
                                </p>
                                <p className={styles.reviewOwnership}>
                                    {r.author}
                                </p>
                                <p className={styles.reviewSubtitle}>
                                    {r.url ? (
                                        <a
                                            href={r.url.startsWith('http://') || r.url.startsWith('https://') ? r.url : `https://${r.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "inherit", textDecoration: "underline" }}
                                        >
                                            {r.source_name}
                                        </a>
                                    ) : (
                                        r.source_name
                                    )}
                                </p>
                                {localContent && (
                                    <p className={styles.reviewDescription}>
                                        {localContent}
                                    </p>
                                )}
                            </article>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
