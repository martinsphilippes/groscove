import { ImageResponse } from "next/og";

export const alt = "Groscove Ultra — Em breve";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, fontSize: 96, fontWeight: 800, letterSpacing: 4 }}>
          GROSCOVE ULTRA
          <div style={{ width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: "70px solid #FD4F05", marginBottom: 16 }} />
        </div>
        <div style={{ marginTop: 32, fontSize: 36, color: "#FD4F05", letterSpacing: 6 }}>01.01.2027</div>
      </div>
    ),
    size,
  );
}
