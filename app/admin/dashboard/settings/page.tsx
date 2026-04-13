"use client";

import { useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { toast } from "sonner";

export default function SettingsPage() {
  const [testEmailAddr, setTestEmailAddr] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleTestEmail = async () => {
    setSendingTest(true);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmailAddr || undefined }),
      });
      const json = await res.json();
      if (json.success) toast.success(json.message);
      else toast.error(json.error);
    } catch {
      toast.error("Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  const handleClearAll = async () => {
    if (confirmText !== "DELETE ALL SUBSCRIBERS") {
      toast.error('Type "DELETE ALL SUBSCRIBERS" to confirm');
      return;
    }
    setClearingAll(true);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE_ALL" }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("All subscribers deleted");
        setConfirmText("");
      } else toast.error(json.error);
    } catch {
      toast.error("Operation failed");
    } finally {
      setClearingAll(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "700px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#ffffff", margin: "0 0 6px", fontWeight: 700 }}>Settings</h1>
          <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>Configuration and admin tools</p>
        </div>

        {/* Email config */}
        <Section title="Email Configuration" icon="✉️">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            {[
              { label: "SMTP Host", value: maskValue(process.env.NEXT_PUBLIC_EMAIL_HOST ?? "smtp.gmail.com") },
              { label: "SMTP Port", value: "587" },
              { label: "From Address", value: "Configured in .env.local" },
              { label: "Provider", value: "Nodemailer / Gmail" },
            ].map(item => (
              <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px" }}>
                <p style={{ color: "#334155", fontSize: "11px", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</p>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0, fontFamily: "var(--font-body)" }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
            <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 12px" }}>
              Send a test email to verify your Nodemailer configuration is working correctly.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="Leave blank to send to ADMIN_EMAIL"
                value={testEmailAddr}
                onChange={e => setTestEmailAddr(e.target.value)}
                style={{
                  flex: 1, minWidth: "240px", padding: "11px 14px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px", color: "#e2e8f0", fontSize: "14px",
                  fontFamily: "var(--font-body)", outline: "none",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(245,166,35,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
              <button
                onClick={handleTestEmail}
                disabled={sendingTest}
                style={{
                  padding: "11px 20px",
                  background: sendingTest ? "rgba(245,166,35,0.2)" : "linear-gradient(135deg,#f5a623,#d4891a)",
                  color: "#0a0f1e", border: "none", borderRadius: "10px",
                  fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-body)",
                  cursor: sendingTest ? "not-allowed" : "pointer", whiteSpace: "nowrap",
                }}
              >
                {sendingTest ? "Sending..." : "Send Test Email"}
              </button>
            </div>
          </div>
        </Section>

        {/* Supabase info */}
        <Section title="Database" icon="🗄️">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "Provider", value: "Supabase" },
              { label: "RLS Status", value: "Disabled (all tables)" },
              { label: "Storage Bucket", value: "ebooks (public)" },
              { label: "Tables", value: "subscribers, ebooks" },
            ].map(item => (
              <div key={item.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px" }}>
                <p style={{ color: "#334155", fontSize: "11px", margin: "0 0 4px", letterSpacing: "0.06em", textTransform: "uppercase" }}>{item.label}</p>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Quick links */}
        <Section title="Quick Links" icon="🔗">
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "View Landing Page", href: "/", desc: "Open the public registration page" },
              { label: "Supabase Dashboard", href: "https://supabase.com/dashboard", desc: "Manage your database directly" },
              { label: "Gmail App Passwords", href: "https://myaccount.google.com/apppasswords", desc: "Generate SMTP credentials" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px", padding: "14px 18px", textDecoration: "none",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(245,166,35,0.2)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)")}
              >
                <div>
                  <p style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 500, margin: "0 0 2px" }}>{link.label}</p>
                  <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>{link.desc}</p>
                </div>
                <span style={{ color: "#334155", fontSize: "16px" }}>↗</span>
              </a>
            ))}
          </div>
        </Section>

        {/* Danger zone */}
        <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            <h2 style={{ color: "#f87171", fontSize: "16px", fontWeight: 600, margin: 0, fontFamily: "var(--font-body)" }}>Danger Zone</h2>
          </div>
          <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 16px", lineHeight: 1.6 }}>
            This will permanently delete <strong style={{ color: "#e2e8f0" }}>all subscribers</strong> from the database. This action cannot be undone.
          </p>
          <p style={{ color: "#475569", fontSize: "12px", margin: "0 0 10px" }}>
            Type <code style={{ background: "rgba(239,68,68,0.1)", padding: "1px 6px", borderRadius: "4px", color: "#f87171", fontSize: "12px" }}>DELETE ALL SUBSCRIBERS</code> to confirm:
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="DELETE ALL SUBSCRIBERS"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              style={{
                flex: 1, minWidth: "240px", padding: "10px 14px",
                background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: "8px", color: "#e2e8f0", fontSize: "13px",
                fontFamily: "var(--font-body)", outline: "none",
              }}
            />
            <button
              onClick={handleClearAll}
              disabled={clearingAll || confirmText !== "DELETE ALL SUBSCRIBERS"}
              style={{
                padding: "10px 18px",
                background: confirmText === "DELETE ALL SUBSCRIBERS" ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: "8px", color: "#f87171", fontSize: "13px", fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: clearingAll || confirmText !== "DELETE ALL SUBSCRIBERS" ? "not-allowed" : "pointer",
                opacity: clearingAll ? 0.5 : 1,
              }}
            >
              {clearingAll ? "Deleting..." : "Delete All Subscribers"}
            </button>
          </div>
        </div>
      </div>
      <style>{`input::placeholder{color:#334155}`}</style>
    </DashboardLayout>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontSize: "18px" }}>{icon}</span>
        <h2 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 600, margin: 0, fontFamily: "var(--font-body)" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function maskValue(val: string) {
  if (!val || val.length < 4) return "••••••";
  return val.slice(0, 3) + "•".repeat(Math.max(4, val.length - 3));
}
