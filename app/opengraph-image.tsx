import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "UK Study Guide — Free Ebook";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0f1e 0%, #1a2744 60%, #0a0f1e 100%)",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(245,166,35,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          display: "flex",
        }} />

        {/* Gold glow */}
        <div style={{
          position: "absolute",
          top: "10%", left: "50%",
          transform: "translateX(-50%)",
          width: "800px", height: "400px",
          background: "radial-gradient(ellipse, rgba(245,166,35,0.08) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Flag */}
        <div style={{ fontSize: "80px", marginBottom: "24px", display: "flex" }}>🇬🇧</div>

        {/* Free badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(245,166,35,0.12)",
          border: "1px solid rgba(245,166,35,0.35)",
          borderRadius: "100px",
          padding: "8px 24px",
          marginBottom: "24px",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f5a623", display: "flex" }} />
          <span style={{ color: "#f5a623", fontSize: "16px", fontWeight: 600, letterSpacing: "0.1em" }}>
            FREE EBOOK
          </span>
        </div>

        {/* Title */}
        <div style={{
          color: "#ffffff",
          fontSize: "64px",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "900px",
        }}>
          Your Journey to the{" "}
          <span style={{ color: "#f5a623" }}>United Kingdom</span>
        </div>

        {/* Subtitle */}
        <div style={{
          color: "#94a3b8",
          fontSize: "24px",
          textAlign: "center",
          maxWidth: "700px",
          display: "flex",
        }}>
          The complete guide to studying, living & thriving in the UK
        </div>

        {/* Bottom bar */}
        <div style={{
          position: "absolute", bottom: "40px",
          display: "flex", alignItems: "center", gap: "40px",
        }}>
          {["University Admissions", "Student Visa", "Accommodation", "Cost of Living"].map(item => (
            <div key={item} style={{ color: "#475569", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#f5a623", display: "flex" }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
