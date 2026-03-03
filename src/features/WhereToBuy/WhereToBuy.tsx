// WhereToBuy.tsx
import * as React from "react";
import styles from "./whereToBuy.module.css";
import { supabase } from "@/shared/lib/supabase";

export type WhereToBuyLink = { title: string; url: string };

type Props = {
    productId?: string;
    accentColor?: string;
};

export default function WhereToBuy({
    productId,
    accentColor,
}: Props) {
    const [links, setLinks] = React.useState<WhereToBuyLink[]>([]);
    const [loading, setLoading] = React.useState(true);

    const style = accentColor
        ? ({ "--accent-color": accentColor } as React.CSSProperties)
        : undefined;

    React.useEffect(() => {
        async function fetchLinks() {
            if (!productId) {
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from("project_links")
                    .select("title, url")
                    .eq("product_id", productId)
                    .eq("active", true)
                    .order("sort_order", { ascending: true });

                if (error) throw error;
                if (data) setLinks(data);
            } catch (error) {
                console.error("Error fetching project links:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchLinks();
    }, [productId]);

    if (loading || !links.length) {
        return null;
    }

    return (
        <div className={styles.root} style={style}>
            <ul className={styles.list}>
                {links.map((l) => (
                    <li key={l.url} className={styles.item}>
                        <a
                            className={styles.link}
                            href={l.url.startsWith('http://') || l.url.startsWith('https://') ? l.url : `https://${l.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {l.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
