"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import type { StatsResponse } from "@/types";
import { formatDateShort } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleResendPending = async () => {
    if (!confirm(`Send ebook to all ${stats?.emailsPending} pending subscribers?`)) return;
    setResending(true);
    try {
      const res = await fetch("/api/admin/subscribers/resend-pending", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        fetchStats();
      } else {
        toast.error(json.error);
      }
    } catch {
      toast.error("Failed to resend emails");
    } finally {
      setResending(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px" }}>
        {/* Page header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#ffffff", margin: "0 0 6px", fontWeight: 700 }}>
            Overview
          </h1>
          <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginBottom: "32px" }}>
          <StatCard
            label="Total Subscribers"
            value={stats?.totalSubscribers ?? 0}
            icon="👥"
            color="#f5a623"
            loading={loading}
          />
          <StatCard
            label="Emails Sent"
            value={stats?.emailsSent ?? 0}
            icon="✉️"
            color="#22c55e"
            loading={loading}
          />
          <StatCard
            label="Pending Emails"
            value={stats?.emailsPending ?? 0}
            icon="⏳"
            color="#f59e0b"
            loading={loading}
            action={
              (stats?.emailsPending ?? 0) > 0
                ? { label: resending ? "Sending..." : "Send All", onClick: handleResendPending }
                : undefined
            }
          />
          <StatCard
            label="Active Ebook"
            value={stats?.activeEbook ? "Uploaded" : "None"}
            icon="📚"
            color="#60a5fa"
            loading={loading}
            isText
          />
        </div>

        {/* Active ebook banner */}
        {!loading && (
          <div style={{
            background: stats?.activeEbook ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
            border: `1px solid ${stats?.activeEbook ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
            borderRadius: "12px", padding: "16px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "12px", marginBottom: "32px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>{stats?.activeEbook ? "📗" : "📕"}</span>
              <div>
                <p style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>
                  {stats?.activeEbook ? stats.activeEbook.title : "No ebook uploaded yet"}
                </p>
                <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>
                  {stats?.activeEbook
                    ? `Uploaded ${formatDateShort(stats.activeEbook.uploaded_at)} · ${stats.activeEbook.file_name}`
                    : "Upload a PDF to start sending to subscribers"}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = "/admin/dashboard/ebooks"}
              style={{
                background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.25)",
                borderRadius: "8px", padding: "8px 16px", color: "#f5a623",
                fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)",
              }}
            >
              {stats?.activeEbook ? "Manage Ebooks →" : "Upload Now →"}
            </button>
          </div>
        )}

        {/* Recent subscribers */}
        <div style={{
          background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px", overflow: "hidden",
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: 0 }}>Recent Subscribers</h2>
            <button
              onClick={() => window.location.href = "/admin/dashboard/subscribers"}
              style={{ background: "transparent", border: "none", color: "#f5a623", fontSize: "13px", cursor: "pointer", fontFamily: "var(--font-body)" }}
            >
              View all →
            </button>
          </div>

          {loading ? (
            <SkeletonTable />
          ) : (stats?.recentSubscribers?.length ?? 0) === 0 ? (
            <EmptyState message="No subscribers yet. Share your landing page to get started!" />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Name", "Email", "Registered", "Email Status"].map((h) => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: "left", color: "#334155", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentSubscribers?.map((sub, i) => (
                    <tr
                      key={sub.id}
                      style={{
                        borderBottom: i < (stats.recentSubscribers?.length ?? 0) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 24px", color: "#e2e8f0", fontSize: "14px" }}>{sub.name}</td>
                      <td style={{ padding: "14px 24px", color: "#64748b", fontSize: "13px" }}>{sub.email}</td>
                      <td style={{ padding: "14px 24px", color: "#475569", fontSize: "13px" }}>{formatDateShort(sub.created_at)}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <StatusBadge sent={sub.email_sent} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon, color, loading, isText, action }: {
  label: string; value: number | string; icon: string; color: string;
  loading?: boolean; isText?: boolean;
  action?: { label: string; onClick: () => void };
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (loading || isText || typeof value !== "number") return;
    const duration = 1200;
    const steps = 40;
    const increment = (value as number) / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, value as number);
      setCount(Math.round(current));
      if (current >= (value as number)) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, loading, isText]);

  return (
    <div style={{
      background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "16px", padding: "20px 22px",
    }}>
      {loading ? (
        <div>
          <div style={{ width: "80px", height: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", marginBottom: "12px" }} />
          <div style={{ width: "50px", height: "28px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "20px" }}>{icon}</span>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
          </div>
          <p style={{ color: "#475569", fontSize: "12px", margin: "0 0 6px", fontFamily: "var(--font-body)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
          <p style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700, margin: "0 0 10px", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
            {isText ? value : count.toLocaleString()}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              style={{
                background: `${color}15`, border: `1px solid ${color}30`,
                borderRadius: "6px", padding: "5px 12px", color, fontSize: "11px",
                fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
              }}
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ sent }: { sent: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: sent ? "rgba(34,197,94,0.1)" : "rgba(245,166,35,0.1)",
      border: `1px solid ${sent ? "rgba(34,197,94,0.25)" : "rgba(245,166,35,0.25)"}`,
      borderRadius: "100px", padding: "3px 10px",
      color: sent ? "#4ade80" : "#fbbf24", fontSize: "11px", fontWeight: 500,
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sent ? "#4ade80" : "#fbbf24", display: "inline-block" }} />
      {sent ? "Sent" : "Pending"}
    </span>
  );
}

function SkeletonTable() {
  return (
    <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ height: "20px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", width: `${70 + Math.random() * 30}%`, animation: "shimmer 1.5s ease infinite" }} />
      ))}
      <style>{`@keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:0.8}}`}</style>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
      <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>{message}</p>
    </div>
  );
}
