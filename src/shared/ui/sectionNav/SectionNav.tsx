// src/shared/ui/section-nav/SectionNav.tsx
import * as React from "react";
import styles from "./SectionNav.module.css";

export type SectionNavItem = { id: string; label: string };

type Props = {
  items: SectionNavItem[];
  ariaLabel?: string;
  sticky?: boolean;
  accentColor?: string;
  headerOffsetPx?: number; // alto del header fijo
};

export default function SectionNav({
  items,
  ariaLabel = "Page sections",
  sticky = true,
  accentColor,
  headerOffsetPx = 0,
}: Props) {
  const navRef = React.useRef<HTMLElement | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [navHeight, setNavHeight] = React.useState(0);

  React.useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      setNavHeight(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    setNavHeight(el.getBoundingClientRect().height);

    return () => ro.disconnect();
  }, []);

  const totalOffset = headerOffsetPx + navHeight;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - totalOffset - 8; // +8px breathing room
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  React.useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        // compensa header + nav (y un margen inferior para que no cambie demasiado tarde)
        rootMargin: `-${totalOffset}px 0px -60% 0px`,
        threshold: [0.2, 0.4, 0.6],
      }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, totalOffset]);

  return (
    <nav
      ref={navRef}
      className={sticky ? `${styles.root} ${styles.sticky}` : styles.root}
      aria-label={ariaLabel}
      style={
        {
          ["--header-offset" as any]: `${headerOffsetPx}px`,
          ["--accent-color" as any]: accentColor,
        } as React.CSSProperties
      }
    >
      <div className={styles.inner}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? `${styles.btn} ${styles.btnActive}` : styles.btn}
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

