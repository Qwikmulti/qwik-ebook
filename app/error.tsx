"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

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
      fontFamily: "var(--font-body, system-ui)",
    }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
      <h2 style={{ color: "#e2e8f0", fontSize: "24px", fontWeight: 700, margin: "0 0 12px" }}>
        Something went wrong
      </h2>
      <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 28px", maxWidth: "400px", lineHeight: 1.6 }}>
        An unexpected error occurred. Please try refreshing the page.
        {error.digest && (
          <span style={{ display: "block", marginTop: "8px", color: "#334155", fontSize: "12px" }}>
            Error ID: {error.digest}
          </span>
        )}
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            background: "linear-gradient(135deg,#f5a623,#d4891a)",
            color: "#0a0f1e", border: "none",
            borderRadius: "10px", padding: "12px 24px",
            fontSize: "14px", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = "/"}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8", borderRadius: "10px",
            padding: "12px 24px", fontSize: "14px",
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
