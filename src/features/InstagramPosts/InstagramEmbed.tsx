import { useEffect } from "react";

type InstagramEmbedProps = {
  permalink: string;
};

export function InstagramEmbed({ permalink }: InstagramEmbedProps) {
  useEffect(() => {
    // Instagram embed script (solo una vez)
    if (!(window as any).instgrm) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(script);
    } else {
      // Reprocesa embeds si el script ya existe
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: 3,
        boxShadow:
          "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: 1,
        maxWidth: 540,
        minWidth: 326,
        padding: 0,
        width: "calc(100% - 2px)",
      }}
    >
      <div style={{ padding: 16 }}>
        <a
          href={permalink}
          target="_blank"
          rel="noreferrer"
          style={{
            background: "#FFFFFF",
            lineHeight: 0,
            padding: "0 0",
            textAlign: "center",
            textDecoration: "none",
            width: "100%",
            display: "block",
          }}
        >
          {/* Header skeleton */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div
              style={{
                backgroundColor: "#F4F4F4",
                borderRadius: "50%",
                height: 40,
                width: 40,
                marginRight: 14,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: 4,
                  height: 14,
                  marginBottom: 6,
                  width: 100,
                }}
              />
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  borderRadius: 4,
                  height: 14,
                  width: 60,
                }}
              />
            </div>
          </div>

          {/* Media placeholder */}
          <div style={{ padding: "19% 0" }} />

          {/* Instagram logo */}
          <div
            style={{
              display: "block",
              height: 50,
              margin: "0 auto 12px",
              width: 50,
            }}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 60 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#000">
                <circle cx="30" cy="30" r="28" fill="none" stroke="#000" />
              </g>
            </svg>
          </div>

          <div style={{ paddingTop: 8 }}>
            <div
              style={{
                color: "#3897f0",
                fontFamily: "Arial, sans-serif",
                fontSize: 14,
                fontWeight: 550,
                lineHeight: "18px",
              }}
            >
              Ver esta publicación en Instagram
            </div>
          </div>
        </a>

        <p
          style={{
            color: "#c9c8cd",
            fontFamily: "Arial, sans-serif",
            fontSize: 14,
            lineHeight: "17px",
            margin: "8px 0 0",
            overflow: "hidden",
            textAlign: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <a
            href={permalink}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#c9c8cd",
              textDecoration: "none",
            }}
          >
            Una publicación compartida en Instagram
          </a>
        </p>
      </div>
    </blockquote>
  );
}
