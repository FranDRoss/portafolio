// src/shared/ui/banner/Banner.tsx
import * as React from "react";
import styles from "./Banner.module.css";

type BannerSize = "xxs" | "xs" | "sm" | "md" | "lg";

type BannerSlots =
  | "wrap"
  | "container"
  | "banner"
  | "bg"
  | "bgImg"
  | "overlay"
  | "content"
  | "title"
  | "subtitle";

type Props = {
  title?: string;
  subtitle?: string;

  /** Backgrounds by breakpoint (all optional) */
  bgImageMobile?: string;
  bgImageTablet?: string;
  bgImageDesktop?: string;

  /** Fallback background if no image (or if you want color-only) */
  bgColor?: string; // e.g. "#F3F4F6" or "var(--some-token)"

  /** Optional overlay to ensure text readability */
  overlay?: boolean;
  overlayOpacity?: number; // 0..1 (default 0.35)

  /** Typography options */
  align?: "left" | "center";

  /** Size variants (sm = base default) */
  size?: BannerSize;

  /** Text colors via CSS variables (no classes needed) */
  titleColor?: string; // e.g. "#fff" or "var(--text-primary)"
  subtitleColor?: string; // e.g. "rgba(255,255,255,.9)" or tokens

  /**
   * Extra CSS module classes from outside, to extend/override styling
   * without editing this component.
   */
  classes?: Partial<Record<BannerSlots, string>>;
};

function cx(...tokens: Array<string | undefined | false>) {
  return tokens.filter(Boolean).join(" ");
}

export default function Banner({
  title,
  subtitle,
  bgImageMobile,
  bgImageTablet,
  bgImageDesktop,
  bgColor = "#f3f4f6",
  overlay = true,
  overlayOpacity = 0.35,
  align = "center",
  size = "sm",
  titleColor,
  subtitleColor,
  classes,
}: Props) {
  const styleVars: React.CSSProperties = {
    ["--banner-bg" as any]: bgColor,
    ["--banner-overlay-opacity" as any]: String(overlayOpacity),
    ...(titleColor ? { ["--banner-title-color" as any]: titleColor } : null),
    ...(subtitleColor
      ? { ["--banner-subtitle-color" as any]: subtitleColor }
      : null),
  };

  // Prefer desktop > tablet > mobile as defaults if only one is provided
  const fallback = bgImageDesktop ?? bgImageTablet ?? bgImageMobile;

  return (
    <section className={cx(styles.wrap, classes?.wrap)} aria-label="Banner">
      <div className={cx(styles.container, classes?.container)}>
        <div
          className={cx(styles.banner, classes?.banner)}
          style={styleVars}
          data-align={align}
          data-size={size}
        >
          {(bgImageMobile || bgImageTablet || bgImageDesktop) && (
            <picture className={cx(styles.bg, classes?.bg)}>
              {bgImageDesktop && (
                <source media="(min-width: 1024px)" srcSet={bgImageDesktop} />
              )}
              {bgImageTablet && (
                <source media="(min-width: 640px)" srcSet={bgImageTablet} />
              )}
              <img
                className={cx(styles.bgImg, classes?.bgImg)}
                src={fallback}
                alt=""
                aria-hidden="true"
              />
            </picture>
          )}

          {overlay && (
            <div
              className={cx(styles.overlay, classes?.overlay)}
              aria-hidden="true"
            />
          )}

          <div className={cx(styles.content, classes?.content)}>
            {title && (
              <h1 className={cx(styles.title, classes?.title)}>{title}</h1>
            )}
            {subtitle && (
              <p className={cx(styles.subtitle, classes?.subtitle)}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
