import * as React from "react";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import styles from "./imageCarousel.module.css";

export type ImageCarouselItem = {
  id: string;
  src: string;
  alt?: string;
  href?: string; // if provided and enableLinks=true, item is clickable
};

type Props = {
  items: ImageCarouselItem[];
  /** px */
  itemWidth?: number;
  /** px */
  itemHeight?: number;
  /** px */
  gap?: number;
  /** If false, items never render as links even if href is provided */
  enableLinks?: boolean;
  /** Circular window behaviour (prev/next wrap around). If false: finite window, arrows appear only when needed */
  infinite?: boolean;
  /** Optional className hook */
  className?: string;
};

function useElementWidth<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0]?.contentRect?.width ?? 0);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);

    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

export default function ImageCarousel({
  items,
  itemWidth = 220,
  itemHeight = 320,
  gap = 16,
  enableLinks = true,
  infinite = false,
  className,
}: Props) {
  const total = items.length;
  if (!total) return null;

  const { ref: viewportRef, width: viewportWidth } =
    useElementWidth<HTMLDivElement>();

  // How many fit fully
  const visibleCount = React.useMemo(() => {
    if (viewportWidth <= 0) return 1;
    const n = Math.floor((viewportWidth + gap) / (itemWidth + gap));
    return Math.max(1, Math.min(n, total));
  }, [viewportWidth, gap, itemWidth, total]);

  const [start, setStart] = React.useState(0);

  // Keep start in range for finite mode when resizing/items change
  React.useEffect(() => {
    if (infinite) return;
    setStart((s) => Math.min(s, Math.max(0, total - visibleCount)));
  }, [total, visibleCount, infinite]);

  const canPrev = infinite ? total > visibleCount : start > 0;
  const canNext = infinite
    ? total > visibleCount
    : start + visibleCount < total;

  const handlePrev = () => {
    if (!canPrev) return;
    setStart((s) => {
      if (infinite) return (s - 1 + total) % total;
      return Math.max(0, s - 1);
    });
  };

  const handleNext = () => {
    if (!canNext) return;
    setStart((s) => {
      if (infinite) return (s + 1) % total;
      return Math.min(total - visibleCount, s + 1);
    });
  };

  const visibleItems = React.useMemo(() => {
    if (!total) return [];
    if (!infinite) return items.slice(start, start + visibleCount);

    // infinite "window" (circular)
    const out: ImageCarouselItem[] = [];
    for (let i = 0; i < visibleCount; i++) {
      out.push(items[(start + i) % total]);
    }
    return out;
  }, [items, start, visibleCount, total, infinite]);

  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      {canPrev ? (
        <button
          type="button"
          className={styles.navBtn}
          data-dir="prev"
          onClick={handlePrev}
          aria-label="Previous"
        />
      ) : (
        <span className={styles.navBtnSpacer} aria-hidden="true" />
      )}

      <div
        ref={viewportRef}
        className={styles.viewport}
        style={
          {
            ["--item-w" as any]: `${itemWidth}px`,
            ["--item-h" as any]: `${itemHeight}px`,
            ["--gap" as any]: `${gap}px`,
          } as React.CSSProperties
        }
      >
        {/* wrapper: allow shadows outside; inner clip hides overflow */}
        <div className={styles.clip}>
          <ul className={styles.track} aria-label="Carousel">
            {visibleItems.map((item) => {
              const clickable = enableLinks && !!item.href;

              const content = (
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  perspective={1000}
                  transitionSpeed={1500}
                  scale={1.05}
                  glareEnable={true}
                  glareMaxOpacity={0.3}
                  glareColor="#ffffff"
                  glarePosition="all"
                  style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
                >
                  <img
                    src={item.src}
                    alt={item.alt ?? ""}
                    className={styles.img}
                    loading="lazy"
                  />
                </Tilt>
              );

              return (
                <li key={`${item.id}-${item.src}`} className={styles.item}>
                  {clickable ? (
                    <Link to={item.href!} className={styles.card} aria-label={item.alt ?? item.id}>
                      {content}
                    </Link>
                  ) : (
                    <div className={styles.card} aria-label={item.alt ?? item.id}>
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {canNext ? (
        <button
          type="button"
          className={styles.navBtn}
          data-dir="next"
          onClick={handleNext}
          aria-label="Next"
        />
      ) : (
        <span className={styles.navBtnSpacer} aria-hidden="true" />
      )}
    </div>
  );
}
