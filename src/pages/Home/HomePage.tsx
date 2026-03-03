import { useState, useEffect } from 'react';
import styles from './home.module.css';
import { useTranslation } from 'react-i18next';
import { InstagramGrid } from '@/features/InstagramPosts/InstagramPosts';
import { supabase } from '@/shared/lib/supabase';
import { HomeNews } from '@/features/HomeNews/HomeNews';
import Banner from '@/shared/ui/banner/Banner';

function HomePage() {
  const { t } = useTranslation();
  const [news, setNews] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [newsRes, postsRes] = await Promise.all([
          supabase
            .from("home_news")
            .select("*")
            .eq("active", true)
            .order("sort_order", { ascending: true }),
          supabase
            .from("home_posts")
            .select("*")
            .eq("active", true)
            .order("sort_order", { ascending: true })
        ]);

        if (newsRes.error) throw newsRes.error;
        if (postsRes.error) throw postsRes.error;

        if (newsRes.data) setNews(newsRes.data);
        if (postsRes.data) setPosts(postsRes.data);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.intro}>
        <h1>{t("home.welcomeMessage")}</h1>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.newsSection}>
          {news.length > 0 && <HomeNews news={news} />}
        </section>

        <section className={styles.socialSection}>
          <Banner align="left" title={t("home.followInstagram")} size="xxs" bgColor="transparent" titleColor="black" overlayOpacity={0} classes={{ wrap: styles.bannerWrap, title: styles.bannerTitle }} />
          {posts.length > 0 && (
            <InstagramGrid
              captioned
              minCardWidth={260}
              gap={12}
              permalinks={posts.filter(p => p.type === 'instagram').map(p => p.url)}
            />
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage
