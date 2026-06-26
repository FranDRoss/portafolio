import * as React from "react";
import styles from "./gallery.module.css";
import { useTranslation } from "react-i18next";
import SEO from "@/shared/ui/seo/SEO";

// Lightbox & grid libraries
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Optional plugins for a rich lightbox experience
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";

// Supabase client
import { supabase } from "@/shared/lib/supabase";
import { Loader } from "@/shared/ui/loader/Loader";

export default function GalleryPage() {
    const { t, i18n } = useTranslation();
    const [index, setIndex] = React.useState(-1);
    const [galleryItems, setGalleryItems] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const currentLang = i18n.language as "en" | "es" | "fr" | "ro";

    React.useEffect(() => {
        async function fetchArtworks() {
            try {
                const { data, error } = await supabase
                    .from("artworks")
                    .select("*")
                    .order("sort_order", { ascending: true });

                if (error) throw error;
                if (data) setGalleryItems(data);
            } catch (error) {
                console.error("Error fetching artworks:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchArtworks();
    }, []);

    // Format and translate photos dynamically based on the DB object
    const translatedPhotos = React.useMemo(() => {
        return galleryItems.map((item) => ({
            src: item.src,
            width: item.width,
            height: item.height,
            title: item.title[currentLang] || item.title["en"],
            description: item.description[currentLang] || item.description["en"]
        }));
    }, [currentLang, galleryItems]);

    return (
        <div className={styles.page}>
            <SEO title={t("gallery.seo.title")} description={t("gallery.seo.description")} />

            <header className={styles.header}>
                <h1 className={styles.title}>{t("gallery.title")}</h1>
                <p className={styles.subtitle}>{t("gallery.subtitle")}</p>
            </header>

            {loading ? (
                <Loader />
            ) : (
                <div className={styles.flexGallery}>
                    {translatedPhotos.map((photo, i) => (
                        <img
                            key={photo.src}
                            src={photo.src}
                            alt={photo.title}
                            className={styles.imageEl}
                            onClick={() => setIndex(i)}
                            loading="lazy"
                        />
                    ))}

                    <Lightbox
                        index={index}
                        slides={translatedPhotos}
                        open={index >= 0}
                        close={() => setIndex(-1)}
                        plugins={[Zoom, Captions]}
                        captions={{ descriptionTextAlign: "center" }}
                    />
                </div>
            )}
        </div>
    );
}
