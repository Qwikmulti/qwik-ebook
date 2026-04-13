import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f1e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
      padding: "24px",
      fontFamily: "var(--font-body)",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: "500px", height: "300px",
        background: "radial-gradient(ellipse, rgba(245,166,35,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🇬🇧</div>

        <div style={{
          display: "inline-block",
          background: "rgba(245,166,35,0.08)",
          border: "1px solid rgba(245,166,35,0.2)",
          borderRadius: "100px",
          padding: "5px 16px",
          color: "#f5a623",
          fontSize: "12px",
          letterSpacing: "0.1em",
          marginBottom: "20px",
        }}>
          404 ERROR
        </div>

        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(36px, 6vw, 64px)",
          color: "#ffffff",
          margin: "0 0 16px",
          fontWeight: 700,
          lineHeight: 1.1,
        }}>
          Page Not Found
        </h1>

        <p style={{
          color: "#64748b",
          fontSize: "16px",
          margin: "0 0 36px",
          maxWidth: "400px",
          lineHeight: 1.6,
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #f5a623, #d4891a)",
              color: "#0a0f1e",
              padding: "13px 28px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
            }}
          >
            ← Back to Home
          </Link>
          <Link
            href="/admin"
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8",
              padding: "13px 28px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
            }}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
