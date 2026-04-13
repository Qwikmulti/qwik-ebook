"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Amara Osei",
    country: "Ghana",
    flag: "🇬🇭",
    university: "University of Manchester",
    text: "This guide saved me so much stress. The visa section alone was worth its weight in gold. I knew exactly what documents I needed months in advance.",
    avatar: "https://i.pravatar.cc/60?u=amara",
    rating: 5,
    course: "MSc Computer Science",
  },
  {
    id: 2,
    name: "Chen Wei",
    country: "China",
    flag: "🇨🇳",
    university: "King's College London",
    text: "As someone with no connections in the UK, this guide was my roadmap. The accommodation chapter helped me find a great flat before I even landed.",
    avatar: "https://i.pravatar.cc/60?u=chenwei",
    rating: 5,
    course: "LLM International Law",
  },
  {
    id: 3,
    name: "Fatima Al-Rashid",
    country: "UAE",
    flag: "🇦🇪",
    university: "University of Edinburgh",
    text: "I was completely overwhelmed before finding this guide. It broke everything down so clearly — finances, NHS registration, even how to open a bank account.",
    avatar: "https://i.pravatar.cc/60?u=fatima",
    rating: 5,
    course: "MBA Business",
  },
  {
    id: 4,
    name: "Diego Hernández",
    country: "Mexico",
    flag: "🇲🇽",
    university: "Imperial College London",
    text: "The cost of living breakdown is incredibly detailed. I used it to plan my budget before arriving and didn't face any financial surprises.",
    avatar: "https://i.pravatar.cc/60?u=diego",
    rating: 5,
    course: "MEng Chemical Engineering",
  },
  {
    id: 5,
    name: "Priya Sharma",
    country: "India",
    flag: "🇮🇳",
    university: "University of Bristol",
    text: "Highly recommend to every international student. The UCAS guidance was spot-on. My personal statement got so much better after following the advice.",
    avatar: "https://i.pravatar.cc/60?u=priya",
    rating: 5,
    course: "BSc Psychology",
  },
  {
    id: 6,
    name: "Kwame Asante",
    country: "Nigeria",
    flag: "🇳🇬",
    university: "University of Leeds",
    text: "I sent this guide to three of my friends who are planning to study in the UK. It's genuinely the most complete resource I've found online.",
    avatar: "https://i.pravatar.cc/60?u=kwame",
    rating: 5,
    course: "PhD Engineering",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 3800);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  return (
    <section style={{ padding: "100px 24px", background: "#0a0f1e", overflow: "hidden" }}>
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
            Student Stories
          </span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "#ffffff",
            margin: "0 0 16px",
            fontWeight: 700,
          }}>
            What Students Are Saying
          </h2>
          <p style={{ color: "#64748b", fontSize: "16px", fontFamily: "var(--font-body)", margin: 0 }}>
            Over 10,000 international students have used this guide.
          </p>
        </div>

        {/* Stars display */}
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "40px" }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: "#f5a623", fontSize: "20px" }}>★</span>
          ))}
          <span style={{ color: "#64748b", fontSize: "14px", fontFamily: "var(--font-body)", marginLeft: "10px", alignSelf: "center" }}>
            4.9/5 from 10,000+ students
          </span>
        </div>

        {/* Featured testimonial */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "24px",
            padding: "48px",
            maxWidth: "720px",
            margin: "0 auto 40px",
            position: "relative",
            minHeight: "220px",
          }}
        >
          {/* Quote mark */}
          <div style={{
            position: "absolute", top: "24px", right: "32px",
            fontFamily: "var(--font-display)",
            fontSize: "80px",
            color: "rgba(245,166,35,0.12)",
            lineHeight: 1,
            userSelect: "none",
          }}>
            &ldquo;
          </div>

          <div key={activeIndex} style={{ animation: "fadeSlide 0.5s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
              <img
                src={testimonials[activeIndex].avatar}
                alt={testimonials[activeIndex].name}
                width={52}
                height={52}
                style={{ borderRadius: "50%", border: "2px solid rgba(245,166,35,0.3)" }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#ffffff", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-body)" }}>
                    {testimonials[activeIndex].name}
                  </span>
                  <span style={{ fontSize: "16px" }}>{testimonials[activeIndex].flag}</span>
                </div>
                <span style={{ color: "#475569", fontSize: "13px", fontFamily: "var(--font-body)" }}>
                  {testimonials[activeIndex].course} · {testimonials[activeIndex].university}
                </span>
              </div>
            </div>

            <p style={{
              color: "#cbd5e1",
              fontSize: "17px",
              fontFamily: "var(--font-display)",
              lineHeight: 1.75,
              margin: "0 0 20px",
              fontStyle: "italic",
            }}>
              &ldquo;{testimonials[activeIndex].text}&rdquo;
            </p>

            <div style={{ display: "flex", gap: "3px" }}>
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <span key={i} style={{ color: "#f5a623", fontSize: "15px" }}>★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "48px" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                width: i === activeIndex ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === activeIndex ? "#f5a623" : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Mini cards row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              onClick={() => setActiveIndex(i)}
              style={{
                background: i === activeIndex ? "rgba(245,166,35,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === activeIndex ? "rgba(245,166,35,0.25)" : "rgba(255,255,255,0.05)"}`,
                borderRadius: "14px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <img src={t.avatar} alt={t.name} width={36} height={36} style={{ borderRadius: "50%", flexShrink: 0 }} />
                <div>
                  <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-body)" }}>
                    {t.name} {t.flag}
                  </div>
                  <div style={{ color: "#475569", fontSize: "11px", fontFamily: "var(--font-body)" }}>{t.country}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "2px" }}>
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} style={{ color: "#f5a623", fontSize: "11px" }}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
