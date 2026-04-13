"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [badgeRef.current, headlineRef.current, subRef.current, scrollRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(32px)";
      el.style.transition = `opacity 0.8s ease, transform 0.8s ease`;
      el.style.transitionDelay = `${i * 0.18}s`;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 80);
    });
  }, []);

  const scrollToForm = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section style={{ position: "relative", height: "100vh", minHeight: "640px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80')",
        backgroundSize: "cover", backgroundPosition: "center",
        transform: "scale(1.04)",
        transition: "transform 8s ease",
      }} />

      {/* Layered dark gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(2,8,23,0.55) 0%, rgba(10,15,30,0.82) 60%, rgba(10,15,30,1) 100%)",
      }} />

      {/* Subtle radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,166,35,0.07) 0%, transparent 70%)",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: "860px", margin: "0 auto" }}>

        {/* Floating badge */}
        <div ref={badgeRef} style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(245,166,35,0.12)",
          border: "1px solid rgba(245,166,35,0.35)",
          borderRadius: "100px",
          padding: "8px 20px",
          marginBottom: "28px",
        }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f5a623", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#f5a623", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", fontFamily: "var(--font-body)" }}>FREE EBOOK — LIMITED TIME</span>
        </div>

        {/* Main headline */}
        <h1 ref={headlineRef} style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 6vw, 72px)",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.12,
          margin: "0 0 24px",
          letterSpacing: "-0.02em",
        }}>
          Your Journey to the{" "}
          <span style={{
            color: "#f5a623",
            position: "relative",
            display: "inline-block",
          }}>
            United Kingdom
            <span style={{
              position: "absolute", bottom: "-4px", left: 0, right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #f5a623, transparent)",
              borderRadius: "2px",
            }} />
          </span>{" "}
          Starts Here
        </h1>

        {/* Subheadline */}
        <p ref={subRef} style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(16px, 2.2vw, 20px)",
          color: "#94a3b8",
          lineHeight: 1.65,
          margin: "0 0 40px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Get your <strong style={{ color: "#cbd5e1" }}>FREE comprehensive guide</strong> to studying and living in the UK — visas, universities, accommodation, and everything in between.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "64px" }}>
          <button
            onClick={scrollToForm}
            style={{
              background: "linear-gradient(135deg, #f5a623, #d4891a)",
              color: "#0a0f1e",
              border: "none",
              borderRadius: "12px",
              padding: "16px 32px",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.transform = "translateY(-2px)";
              (e.target as HTMLElement).style.boxShadow = "0 8px 32px rgba(245,166,35,0.4)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.transform = "translateY(0)";
              (e.target as HTMLElement).style.boxShadow = "none";
            }}
          >
            Get My Free Guide →
          </button>
          <button
            onClick={scrollToForm}
            style={{
              background: "transparent",
              color: "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "16px 32px",
              fontSize: "15px",
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.borderColor = "rgba(245,166,35,0.5)";
              (e.target as HTMLElement).style.background = "rgba(245,166,35,0.06)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            Learn More
          </button>
        </div>

        {/* Trust bar */}
        <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "📧", text: "Instant delivery" },
            { icon: "🔒", text: "No spam, ever" },
            { icon: "✅", text: "10,000+ students" },
            { icon: "🆓", text: "Completely free" },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{ fontSize: "14px" }}>{item.icon}</span>
              <span style={{ color: "#64748b", fontSize: "13px", fontFamily: "var(--font-body)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{
        position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        cursor: "pointer",
      }} onClick={scrollToForm}>
        <span style={{ color: "#475569", fontSize: "11px", letterSpacing: "0.12em", fontFamily: "var(--font-body)", textTransform: "uppercase" }}>Scroll</span>
        <div style={{
          width: "22px", height: "36px",
          border: "1.5px solid rgba(255,255,255,0.15)",
          borderRadius: "12px",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          padding: "5px",
        }}>
          <div style={{
            width: "3px", height: "8px",
            background: "#f5a623",
            borderRadius: "2px",
            animation: "scrollDot 1.8s ease infinite",
          }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
