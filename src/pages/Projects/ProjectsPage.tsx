import styles from './projects.module.css'
import { useTranslation } from 'react-i18next';
import Banner from '@/shared/ui/banner/Banner';
import SectionNav from '@/shared/ui/sectionNav/SectionNav';
import ImageCarousel from "@/shared/ui/image-carousel/ImageCarousel";
import { supabase } from "@/shared/lib/supabase";
import * as React from "react";
import type { ProjectData } from "@/shared/types/project";

function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [projectsData, setProjectsData] = React.useState<ProjectData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const currentLang = i18n.language as "en" | "es" | "fr" | "ro";

  React.useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("active", true)
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (data) setProjectsData(data as ProjectData[]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) return null;

  const items: { id: string; label: string }[] = [];

  const comicItemsRaw = projectsData.filter(p => p.type === "graphic-novel");
  const collabItemsRaw = projectsData.filter(p => p.type === "collaboration-comic");
  const otherItemsRaw = projectsData.filter(p => p.type === "other");

  const mapToCarousel = (projs: ProjectData[]) => projs.map(p => ({
    id: p.id,
    src: p.src_cover || "",
    title: p.title?.[currentLang] || p.title?.["en"] || p.id,
    href: p.id,
    type: p.type as any
  }));

  const comicItems = mapToCarousel(comicItemsRaw);
  if (comicItems.length !== 0) { items.push({ id: "comic", label: t("projects.general.comic") }) }
  const collabItems = mapToCarousel(collabItemsRaw);
  if (collabItems.length !== 0) { items.push({ id: "collabs", label: t("projects.general.collabs") }) }
  const otherItems = mapToCarousel(otherItemsRaw);
  if (otherItems.length !== 0) { items.push({ id: "others", label: t("projects.general.others") }) }

  return (
    <>
      <Banner title={t("projects.general.my")} align='left' titleColor='black' overlayOpacity={0} bgColor='transparent' classes={{ title: styles.bannerNoTextShadow }} />
      <SectionNav items={items} headerOffsetPx={72} />

      {comicItems.length > 0 && (
        <section id="comic">
          <Banner title={t("projects.general.comic")} size='xxs' bgColor='transparent' titleColor='black' overlayOpacity={0} classes={{ banner: styles.bannerMargin, wrap: styles.bannerNoTextShadow, title: styles.bannerLine }} />
          <ImageCarousel
            items={comicItems}
            itemWidth={220}
            itemHeight={320}
            gap={16}
            enableLinks
            infinite={false}
          />
        </section>
      )}

      {collabItems.length > 0 && (
        <section id="collabs">
          <Banner title={t("projects.general.collabs")} size='xxs' bgColor='transparent' titleColor='black' overlayOpacity={0} classes={{ banner: styles.bannerMargin, wrap: styles.bannerNoTextShadow, title: styles.bannerLine }} />
          <ImageCarousel
            items={collabItems}
            itemWidth={220}
            itemHeight={320}
            gap={16}
            enableLinks
            infinite={false}
          />
        </section>
      )}

      {otherItems.length > 0 && (
        <section id="others">
          <Banner title={t("projects.general.others")} size='xxs' bgColor='transparent' titleColor='black' overlayOpacity={0} classes={{ banner: styles.bannerMargin, wrap: styles.bannerNoTextShadow, title: styles.bannerLine }} />
          <ImageCarousel
            items={otherItems}
            itemWidth={220}
            itemHeight={320}
            gap={16}
            enableLinks
            infinite={false}
          />
        </section>
      )}
    </>
  )
}

export default ProjectsPage
