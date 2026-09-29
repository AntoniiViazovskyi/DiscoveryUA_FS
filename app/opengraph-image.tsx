import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const alt =
  "RelaxMap — природні місця для відпочинку та подорожей Україною";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#d8d6d3",
          color: "#4c2613",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 34,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              background: "#cc6534",
              color: "#ffffff",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            R
          </div>
          {SITE_NAME}
        </div>

        <div
          style={{
            maxWidth: 980,
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.08,
              fontWeight: 700,
              letterSpacing: "-2px",
            }}
          >
            Відкривайте місця, куди хочеться повернутися
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 28,
              lineHeight: 1.4,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
