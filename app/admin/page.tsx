"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validations";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/admin/dashboard");
  }, [status, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginInput) => {
    setLoading(true);
    setAuthError("");
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setAuthError("Invalid email or password. Please try again.");
    } else {
      router.push("/admin/dashboard");
    }
  };

  if (status === "loading") return <FullScreenLoader />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020817",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse, rgba(245,166,35,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.2), transparent)",
      }} />

      <div style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🇬🇧</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            color: "#ffffff",
            margin: "0 0 6px",
            fontWeight: 700,
          }}>UK Study Guide</h1>
          <p style={{ color: "#475569", fontSize: "13px", fontFamily: "var(--font-body)", margin: 0 }}>
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          padding: "36px",
        }}>
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "#e2e8f0",
              margin: "0 0 6px",
              fontWeight: 600,
            }}>Sign in</h2>
            <p style={{ color: "#475569", fontSize: "13px", fontFamily: "var(--font-body)", margin: 0 }}>
              Enter your admin credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", color: "#64748b", fontSize: "12px", fontFamily: "var(--font-body)", fontWeight: 500, marginBottom: "7px", letterSpacing: "0.04em" }}>
                EMAIL ADDRESS
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@yourdomain.com"
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "10px", color: "#e2e8f0",
                  fontSize: "14px", fontFamily: "var(--font-body)",
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(245,166,35,0.4)")}
                onBlur={e => (e.target.style.borderColor = errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)")}
              />
              {errors.email && <p style={{ color: "#f87171", fontSize: "11px", marginTop: "5px", fontFamily: "var(--font-body)" }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#64748b", fontSize: "12px", fontFamily: "var(--font-body)", fontWeight: 500, marginBottom: "7px", letterSpacing: "0.04em" }}>
                PASSWORD
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "10px", color: "#e2e8f0",
                  fontSize: "14px", fontFamily: "var(--font-body)",
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(245,166,35,0.4)")}
                onBlur={e => (e.target.style.borderColor = errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)")}
              />
              {errors.password && <p style={{ color: "#f87171", fontSize: "11px", marginTop: "5px", fontFamily: "var(--font-body)" }}>{errors.password.message}</p>}
            </div>

            {/* Auth error */}
            {authError && (
              <div style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px", padding: "10px 14px", marginBottom: "18px",
              }}>
                <p style={{ color: "#f87171", fontSize: "13px", margin: 0, fontFamily: "var(--font-body)" }}>⚠ {authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "rgba(245,166,35,0.3)" : "linear-gradient(135deg,#f5a623,#d4891a)",
                color: "#0a0f1e", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-body)",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {loading ? <><Spinner />Signing in...</> : "Sign In to Dashboard →"}
            </button>
          </form>
        </div>

      </div>
      <style>{`input::placeholder{color:#334155}`}</style>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{ width: "14px", height: "14px", border: "2px solid rgba(10,15,30,0.3)", borderTopColor: "#0a0f1e", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </span>
  );
}

function FullScreenLoader() {
  return (
    <div style={{ minHeight: "100vh", background: "#020817", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", border: "2px solid rgba(245,166,35,0.2)", borderTopColor: "#f5a623", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
