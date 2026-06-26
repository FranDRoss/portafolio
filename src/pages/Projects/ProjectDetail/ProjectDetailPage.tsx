import styles from './projectDetail.module.css'
import { useTranslation } from 'react-i18next';
import CharactersPanel from '@/features/CharacterPanels/CharacterPanel';
import Banner from '@/shared/ui/banner/Banner';
import SectionNav from '@/shared/ui/sectionNav/SectionNav';
import { Navigate, useParams } from 'react-router-dom';
import type { ProjectData } from "@/shared/types/project";
import ProductInfo from '@/features/ProductInfo/ProductInfo';
import ProductReviews from '@/features/ProductReviews/ProductReviews';
import WhereToBuy from '@/features/WhereToBuy/WhereToBuy';
import { supabase } from "@/shared/lib/supabase";
import * as React from "react";
import { Loader } from "@/shared/ui/loader/Loader";

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();

  const [project, setProject] = React.useState<ProjectData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [hasBuyLinks, setHasBuyLinks] = React.useState(false);
  const [hasReviews, setHasReviews] = React.useState(false);

  const currentLang = i18n.language as "en" | "es" | "fr" | "ro";

  React.useEffect(() => {
    async function fetchProjectData() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .eq("active", true)
          .single();

        if (projectError || !projectData) throw projectError;

        const { data: charsData } = await supabase
          .from("project_characters")
          .select("*")
          .eq("product_id", id)
          .eq("active", true)
          .order("sort_order", { ascending: true });

        const fullProject = {
          ...projectData,
          characters: charsData || []
        } as ProjectData;

        setProject(fullProject);

        const [linksRes, reviewsRes] = await Promise.all([
          supabase
            .from("project_links")
            .select("*", { count: "exact", head: true })
            .eq("product_id", id)
            .eq("active", true),
          supabase
            .from("project_reviews")
            .select("*", { count: "exact", head: true })
            .eq("product_id", id)
            .eq("active", true)
        ]);

        setHasBuyLinks(!linksRes.error && linksRes.count ? linksRes.count > 0 : false);
        setHasReviews(!reviewsRes.error && reviewsRes.count ? reviewsRes.count > 0 : false);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectData();
  }, [id]);

  if (loading) return <Loader />;
  if (!id || !project) return <Navigate to="/projects" replace />;

  const title = project.title?.[currentLang] || project.title?.["en"] || project.id;
  const subtitle = project.subtitle?.[currentLang] || project.subtitle?.["en"] || "";
  const description = project.description?.[currentLang] || project.description?.["en"] || "";

  const items = [
    { id: "information", label: t("projects.general.information") },
  ];

  if (project.characters && project.characters.length > 0) {
    items.push({ id: "characters", label: t("projects.general.characters") });
  }

  if (hasReviews) {
    items.push({ id: "reviews", label: t("projects.general.reviews") });
  }

  if (hasBuyLinks) {
    items.push({ id: "where-to-buy", label: t("projects.general.where-to-buy") });
  }

  const accentColor = project.banner_accent_color || "transparent";

  const mappedCharacters = (project.characters || []).map(c => ({
    id: c.character_id || c.id,
    avatarSrc: c.avatar_src || "",
    imageSrc: c.image_src || undefined,
    title: c.title?.[currentLang] || c.title?.["en"] || c.character_id,
    subtitle: c.subtitle?.[currentLang] || c.subtitle?.["en"] || "",
    description: c.description?.[currentLang] || c.description?.["en"] || "",
  }));

  return (
    <>
      <Banner
        title={title}
        subtitle={subtitle}
        bgColor={accentColor}
        align="left"
        bgImageDesktop={project.banner_desktop || undefined}
        bgImageTablet={project.banner_tablet || undefined}
        bgImageMobile={project.banner_mobile || undefined}
        overlayOpacity={0} />

      <SectionNav items={items} headerOffsetPx={72} accentColor={accentColor} />

      <section id="information" style={{ '--accent-color': accentColor } as React.CSSProperties}>
        <Banner title={t("projects.general.information")} size='xxs' bgColor='transparent' titleColor='black' overlayOpacity={0} classes={{ wrap: styles.bannerNoTextShadow, title: styles.bannerLine }} />
        <ProductInfo
          srcCover={project.src_cover}
          title={title}
          subtitle={subtitle}
          description={description}
        />
      </section>

      {mappedCharacters.length > 0 && (
        <section id="characters" style={{ '--accent-color': accentColor } as React.CSSProperties} >
          <Banner title={t("projects.general.characters")} size='xxs' bgColor='transparent' titleColor='black' overlayOpacity={0} classes={{ banner: styles.bannerMargin, wrap: styles.bannerNoTextShadow, title: styles.bannerLine }} />
          <CharactersPanel
            avatarSize={80}
            items={mappedCharacters}
            accentColor={accentColor}
          />
        </section>
      )}

      {hasReviews && (
        <section id="reviews" style={{ '--accent-color': accentColor } as React.CSSProperties}>
          <Banner title={t("projects.general.reviews")} size='xxs' bgColor='transparent' titleColor='black' overlayOpacity={0} classes={{ banner: styles.bannerMargin, wrap: styles.bannerNoTextShadow, title: styles.bannerLine }} />
          <ProductReviews product={{ pId: id }} accentColor={accentColor} />
        </section>
      )}

      {hasBuyLinks && (
        <section id="where-to-buy" style={{ '--accent-color': accentColor } as React.CSSProperties}>
          <Banner title={t("projects.general.where-to-buy")} size='xxs' bgColor='transparent' titleColor='black' overlayOpacity={0} classes={{ banner: styles.bannerMargin, wrap: styles.bannerNoTextShadow, title: styles.bannerLine }} />
          <WhereToBuy productId={id} />
        </section>
      )}
    </>
  )
}

export default ProjectDetailPage
