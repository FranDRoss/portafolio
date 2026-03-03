// src/components/InstagramGrid.tsx
import * as React from "react";
import styles from './posts.module.css'

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

type InstagramGridProps = {
  permalinks: string[];
  gap?: number;
  minCardWidth?: number; // ancho mínimo por tarjeta antes de saltar a la siguiente fila
  captioned?: boolean;
  embedVersion?: string;
};

function ensureInstagramEmbedScriptLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Si ya está cargado, listo
    if (window.instgrm?.Embeds?.process) return resolve();

    // Si ya existe el script pero aún no inicializó, esperamos al load
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Instagram embed.js")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Instagram embed.js"));
    document.body.appendChild(script);
  });
}

export function InstagramGrid({
  permalinks,
  gap = 12,
  minCardWidth = 320,
  captioned = false,
  embedVersion = "14",
}: InstagramGridProps) {
  const [scriptError, setScriptError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      try {
        await ensureInstagramEmbedScriptLoaded();
        if (!alive) return;
        window.instgrm?.Embeds?.process?.();
      } catch (e: any) {
        if (!alive) return;
        setScriptError(e?.message ?? "Error cargando Instagram embed");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    window.instgrm?.Embeds?.process?.();
  }, [permalinks]);

  if (!permalinks?.length) return <div>Sin posts</div>;
  if (scriptError) return <div className={styles.error}>Error: {scriptError}</div>;

  return (
    <div
      className={styles.grid}
      style={
        {
          ["--ig-gap" as any]: `${gap}px`,
          ["--ig-min" as any]: `${minCardWidth}px`,
        } as React.CSSProperties
      }
    >
      {permalinks.map((permalink) => (
        <div key={permalink} className={styles.cell}>
          {/* className se mantiene global para que embed.js lo detecte */}
          <blockquote
            className={`instagram-media ${styles.embed}`}
            data-instgrm-permalink={permalink}
            data-instgrm-version={embedVersion}
            {...(captioned ? { "data-instgrm-captioned": "" } : {})}
          >
            <a href={permalink} target="_blank" rel="noreferrer">
              Abrir en Instagram
            </a>
          </blockquote>
        </div>
      ))}
    </div>
  );
}