"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribeSchema, type SubscribeInput } from "@/lib/validations";

type FormState = "idle" | "loading" | "success" | "error";

export default function RegistrationForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const confettiRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
  });

  const spawnConfetti = () => {
    if (!confettiRef.current) return;
    const colors = ["#f5a623", "#ffffff", "#94a3b8", "#fad48e", "#f7be5a"];
    for (let i = 0; i < 48; i++) {
      const dot = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 7 + 4;
      dot.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        background:${color}; border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        left:${Math.random() * 100}%; top:50%;
        pointer-events:none; z-index:50;
        animation: confettiFall ${1.2 + Math.random() * 1.2}s ease-out forwards;
        animation-delay:${Math.random() * 0.4}s;
      `;
      confettiRef.current.appendChild(dot);
      setTimeout(() => dot.remove(), 2800);
    }
  };

  const onSubmit = async (data: SubscribeInput) => {
    setFormState("loading");
    setServerError("");
    setSubscriberName(data.name.split(" ")[0]);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setFormState("success");
      spawnConfetti();
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An error occurred.");
      setFormState("error");
    }
  };

  return (
    <section id="register" style={{ padding: "80px 24px", background: "linear-gradient(to bottom, #0a0f1e 0%, #0f1629 100%)" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", position: "relative" }} ref={confettiRef}>

        {/* Section label */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(245,166,35,0.1)",
            border: "1px solid rgba(245,166,35,0.25)",
            borderRadius: "100px",
            padding: "5px 16px",
            color: "#f5a623",
            fontSize: "12px",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            Free Download
          </span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: "#ffffff",
            margin: "0 0 12px",
            fontWeight: 700,
            lineHeight: 1.2,
          }}>
            Get Your Free Guide Now
          </h2>
          <p style={{ color: "#64748b", fontSize: "15px", fontFamily: "var(--font-body)", margin: 0 }}>
            Enter your details and we&apos;ll send it straight to your inbox.
          </p>
        </div>

        {/* Glass card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Subtle top accent line */}
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.5), transparent)",
          }} />

          {formState === "success" ? (
            <SuccessState name={subscriberName} onReset={() => setFormState("idle")} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Name field */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{
                  display: "block",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  marginBottom: "8px",
                  letterSpacing: "0.04em",
                }}>
                  Full Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${errors.name ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "10px",
                    color: "#e2e8f0",
                    fontSize: "15px",
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(245,166,35,0.5)")}
                  onBlur={e => (e.target.style.borderColor = errors.name ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)")}
                />
                {errors.name && (
                  <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                    ⚠ {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div style={{ marginBottom: "28px" }}>
                <label style={{
                  display: "block",
                  color: "#94a3b8",
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  marginBottom: "8px",
                  letterSpacing: "0.04em",
                }}>
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${errors.email ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "10px",
                    color: "#e2e8f0",
                    fontSize: "15px",
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(245,166,35,0.5)")}
                  onBlur={e => (e.target.style.borderColor = errors.email ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)")}
                />
                {errors.email && (
                  <p style={{ color: "#f87171", fontSize: "12px", marginTop: "6px", fontFamily: "var(--font-body)" }}>
                    ⚠ {errors.email.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {formState === "error" && serverError && (
                <div style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  animation: "shake 0.4s ease",
                }}>
                  <p style={{ color: "#f87171", fontSize: "13px", margin: 0, fontFamily: "var(--font-body)" }}>
                    ⚠ {serverError}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={formState === "loading"}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: formState === "loading"
                    ? "rgba(245,166,35,0.4)"
                    : "linear-gradient(135deg, #f5a623, #d4891a)",
                  color: "#0a0f1e",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  cursor: formState === "loading" ? "not-allowed" : "pointer",
                  letterSpacing: "0.02em",
                  transition: "transform 0.15s ease, opacity 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {formState === "loading" ? (
                  <>
                    <Spinner />
                    Sending your guide...
                  </>
                ) : (
                  "Send Me The Free Guide →"
                )}
              </button>

              {/* Trust signals */}
              <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "20px", flexWrap: "wrap" }}>
                {["📧 Instant delivery", "🔒 No spam", "✅ Free forever"].map((t) => (
                  <span key={t} style={{ color: "#475569", fontSize: "12px", fontFamily: "var(--font-body)" }}>{t}</span>
                ))}
              </div>
            </form>
          )}
        </div>

        {/* Floating decorative elements */}
        <div style={{
          position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px",
          background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "-30px", width: "160px", height: "160px",
          background: "radial-gradient(circle, rgba(30,58,95,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-180px) rotate(${Math.random() > 0.5 ? "" : "-"}${Math.floor(Math.random() * 360)}deg); opacity: 0; }
        }
        input::placeholder { color: #475569; }
      `}</style>
    </section>
  );
}

function Spinner() {
  return (
    <span style={{
      width: "16px", height: "16px",
      border: "2px solid rgba(10,15,30,0.3)",
      borderTopColor: "#0a0f1e",
      borderRadius: "50%",
      display: "inline-block",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </span>
  );
}

function SuccessState({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      {/* Animated checkmark */}
      <div style={{
        width: "72px", height: "72px",
        background: "rgba(34,197,94,0.12)",
        border: "2px solid rgba(34,197,94,0.4)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
        animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)",
        fontSize: "26px",
        color: "#ffffff",
        margin: "0 0 12px",
        fontWeight: 700,
      }}>
        Check your inbox, {name}! 🎉
      </h3>
      <p style={{ color: "#64748b", fontSize: "15px", fontFamily: "var(--font-body)", margin: "0 0 28px", lineHeight: 1.6 }}>
        Your free UK Study & Travel Guide is on its way. Check your email (and your spam folder just in case).
      </p>

      <button
        onClick={onReset}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "10px",
          padding: "10px 24px",
          color: "#64748b",
          fontSize: "13px",
          fontFamily: "var(--font-body)",
          cursor: "pointer",
        }}
      >
        Register another email
      </button>

      <style>{`@keyframes popIn{0%{transform:scale(0.5);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
