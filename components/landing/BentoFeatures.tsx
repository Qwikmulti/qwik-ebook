"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    id: 1,
    title: "University Admissions",
    description: "Step-by-step guide to applying to top UK universities through UCAS, personal statements, and interview tips.",
    icon: "🎓",
    imageUrl: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&q=75",
    wide: false,
    accent: "#f5a623",
  },
  {
    id: 2,
    title: "Student Visa Guide",
    description: "Everything you need to know about the UK Student Visa — documents, timelines, fees, and common mistakes to avoid.",
    icon: "🛂",
    imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=75",
    wide: false,
    accent: "#60a5fa",
  },
  {
    id: 3,
    title: "Work While You Study",
    description: "Understand your rights to work part-time in the UK, find graduate jobs, and make the most of your student status.",
    icon: "💼",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=75",
    wide: true,
    accent: "#34d399",
  },
  {
    id: 4,
    title: "Cost of Living",
    description: "Realistic budget breakdowns for London, Manchester, Edinburgh, and other major student cities.",
    icon: "💷",
    imageUrl: "https://images.unsplash.com/photo-1601925228215-9de1fcc2c75d?w=800&q=75",
    wide: false,
    accent: "#a78bfa",
  },
  {
    id: 5,
    title: "Student Accommodation",
    description: "How to find and secure student halls, private rentals, and flatshares before you arrive.",
    icon: "🏠",
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=75",
    wide: false,
    accent: "#fb7185",
  },
];

export default function BentoFeatures() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll<HTMLElement>("[data-card]");
            cards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: "100px 24px", background: "#0f1629" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(245,166,35,0.1)",
            border: "1px solid rgba(245,166,35,0.2)",
            borderRadius: "100px",
            padding: "5px 16px",
            color: "#f5a623",
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "var(--font-body)",
            marginBottom: "16px",
          }}>
            What&apos;s Inside
          </span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "#ffffff",
            margin: "0 0 16px",
            fontWeight: 700,
            lineHeight: 1.15,
          }}>
            Everything You Need to<br />
            <span style={{ color: "#f5a623" }}>Succeed in the UK</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: "16px", fontFamily: "var(--font-body)", margin: 0, maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            Our guide covers every aspect of UK student life so you can arrive prepared and confident.
          </p>
        </div>

        {/* Bento grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "280px 280px",
          gap: "16px",
        }}>
          {features.map((f, i) => (
            <BentoCard key={f.id} feature={f} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "56px" }}>
          <p style={{ color: "#475569", fontSize: "15px", fontFamily: "var(--font-body)", margin: "0 0 20px" }}>
            Plus NHS access, transport, cultural tips, and much more inside the guide.
          </p>
          <button
            onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "linear-gradient(135deg, #f5a623, #d4891a)",
              color: "#0a0f1e",
              border: "none",
              borderRadius: "10px",
              padding: "14px 28px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Download All Of This — Free →
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .bento-grid { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .bento-wide { grid-column: 1 !important; }
        }
      `}</style>
    </section>
  );
}

function BentoCard({ feature: f, index }: { feature: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const isWide = f.wide;

  return (
    <div
      ref={cardRef}
      data-card
      style={{
        gridColumn: isWide ? "span 2" : "span 1",
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
        opacity: 0,
        transform: "translateY(28px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
      }}
      onMouseEnter={e => {
        const img = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-img]");
        if (img) img.style.transform = "scale(1.07)";
        const overlay = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-overlay]");
        if (overlay) overlay.style.background = "linear-gradient(to top, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0.5) 60%, rgba(10,15,30,0.2) 100%)";
      }}
      onMouseLeave={e => {
        const img = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-img]");
        if (img) img.style.transform = "scale(1)";
        const overlay = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-overlay]");
        if (overlay) overlay.style.background = "linear-gradient(to top, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.4) 60%, transparent 100%)";
      }}
    >
      {/* Background image */}
      <div
        data-img
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${f.imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      />

      {/* Gradient overlay */}
      <div
        data-overlay
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.4) 60%, transparent 100%)",
          transition: "background 0.4s ease",
        }}
      />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}>
        {/* Icon badge */}
        <div style={{
          width: "42px", height: "42px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px",
          marginBottom: "12px",
        }}>
          {f.icon}
        </div>

        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: isWide ? "24px" : "20px",
          color: "#ffffff",
          margin: "0 0 8px",
          fontWeight: 700,
          lineHeight: 1.2,
        }}>
          {f.title}
        </h3>
        <p style={{
          color: "#94a3b8",
          fontSize: "13px",
          fontFamily: "var(--font-body)",
          margin: "0 0 14px",
          lineHeight: 1.6,
          maxWidth: isWide ? "460px" : "100%",
        }}>
          {f.description}
        </p>

        {/* Tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: `${f.accent}18`,
          border: `1px solid ${f.accent}40`,
          borderRadius: "100px",
          padding: "4px 12px",
          width: "fit-content",
        }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: f.accent, display: "inline-block" }} />
          <span style={{ color: f.accent, fontSize: "11px", fontFamily: "var(--font-body)", fontWeight: 500 }}>
            Included in guide
          </span>
        </div>
      </div>
    </div>
  );
}
