import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.claim}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#04070d",
          backgroundImage:
            "radial-gradient(900px 500px at 12% 4%, rgba(255,149,34,0.30), transparent 62%), radial-gradient(760px 480px at 92% 100%, rgba(23,183,156,0.22), transparent 60%)",
          color: "#f7f9fc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 22,
              backgroundColor: "#ff9522",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#20120a",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            H
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, letterSpacing: -0.5 }}>
            Hauruck<span style={{ color: "#ffb454" }}>24</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -2,
              maxWidth: 950,
            }}
          >
            Umzug und Entrümpelung in Schwäbisch Gmünd
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#b3c0d4" }}>
            Wir tragen, fahren, räumen und entsorgen.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: "28px",
            fontSize: 26,
            color: "#d3dcea",
          }}
        >
          <div style={{ display: "flex" }}>{site.contact.phoneDisplay}</div>
          <div style={{ display: "flex" }}>Montag bis Samstag, 07:30 bis 18:30 Uhr</div>
        </div>
      </div>
    ),
    size,
  );
}
