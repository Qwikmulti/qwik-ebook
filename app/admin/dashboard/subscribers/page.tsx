"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import type { Subscriber } from "@/types";
import { formatDate, downloadCSV } from "@/lib/utils";
import { toast } from "sonner";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const perPage = 10;

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), perPage: String(perPage), search });
      const res = await fetch(`/api/admin/subscribers?${params}`);
      const json = await res.json();
      if (json.success) {
        setSubscribers(json.data.subscribers);
        setTotal(json.data.total);
      }
    } catch {
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete subscriber "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Subscriber deleted");
        fetchSubscribers();
      } else toast.error(json.error);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleResend = async (id: string, email: string) => {
    setResendingId(id);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}/resend`, { method: "POST" });
      const json = await res.json();
      if (json.success) toast.success(`Ebook resent to ${email}`);
      else toast.error(json.error);
    } catch {
      toast.error("Resend failed");
    } finally {
      setResendingId(null);
      fetchSubscribers();
    }
  };

  const handleExportCSV = () => {
    const rows = subscribers.map(s => ({
      Name: s.name, Email: s.email,
      Registered: new Date(s.created_at).toISOString(),
      "Email Sent": s.email_sent ? "Yes" : "No",
      "Sent At": s.email_sent_at ?? "",
    }));
    downloadCSV(rows, `subscribers-${new Date().toISOString().slice(0,10)}.csv`);
    toast.success("CSV downloaded");
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "1200px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#ffffff", margin: "0 0 6px", fontWeight: 700 }}>Subscribers</h1>
            <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>
              {total.toLocaleString()} total subscriber{total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px", padding: "10px 18px", color: "#94a3b8",
              fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)",
            }}
          >
            ↓ Export CSV
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "20px", maxWidth: "360px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#334155", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{
              width: "100%", padding: "11px 14px 11px 40px",
              background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px", color: "#e2e8f0", fontSize: "14px",
              fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(245,166,35,0.3)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
          />
        </div>

        {/* Table */}
        <div style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["#", "Name", "Email", "Registered", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 20px", textAlign: "left", color: "#334155", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(perPage)].map((_, i) => <SkeletonRow key={i} cols={6} />)
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#334155", fontSize: "14px" }}>
                      {search ? `No subscribers matching "${search}"` : "No subscribers yet"}
                    </td>
                  </tr>
                ) : subscribers.map((sub, i) => (
                  <tr
                    key={sub.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 20px", color: "#334155", fontSize: "12px" }}>{(page - 1) * perPage + i + 1}</td>
                    <td style={{ padding: "14px 20px", color: "#e2e8f0", fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap" }}>{sub.name}</td>
                    <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "13px" }}>{sub.email}</td>
                    <td style={{ padding: "14px 20px", color: "#475569", fontSize: "12px", whiteSpace: "nowrap" }}>{formatDate(sub.created_at)}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <StatusBadge sent={sub.email_sent} />
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <ActionBtn
                          label={resendingId === sub.id ? "..." : "Resend"}
                          color="#60a5fa"
                          disabled={resendingId === sub.id}
                          onClick={() => handleResend(sub.id, sub.email)}
                        />
                        <ActionBtn
                          label={deletingId === sub.id ? "..." : "Delete"}
                          color="#f87171"
                          disabled={deletingId === sub.id}
                          onClick={() => handleDelete(sub.id, sub.name)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <span style={{ color: "#334155", fontSize: "13px" }}>
                Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <PagBtn label="← Prev" disabled={page === 1} onClick={() => setPage(p => p - 1)} />
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <PagBtn key={p} label={String(p)} active={p === page} onClick={() => setPage(p)} />
                  );
                })}
                <PagBtn label="Next →" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} />
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`input::placeholder{color:#334155}`}</style>
    </DashboardLayout>
  );
}

function StatusBadge({ sent }: { sent: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      background: sent ? "rgba(34,197,94,0.1)" : "rgba(245,166,35,0.1)",
      border: `1px solid ${sent ? "rgba(34,197,94,0.25)" : "rgba(245,166,35,0.25)"}`,
      borderRadius: "100px", padding: "3px 10px",
      color: sent ? "#4ade80" : "#fbbf24", fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sent ? "#4ade80" : "#fbbf24", flexShrink: 0 }} />
      {sent ? "Sent" : "Pending"}
    </span>
  );
}

function ActionBtn({ label, color, disabled, onClick }: { label: string; color: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: `${color}10`, border: `1px solid ${color}25`,
        borderRadius: "6px", padding: "5px 11px",
        color, fontSize: "12px", fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "var(--font-body)", opacity: disabled ? 0.5 : 1,
        transition: "background 0.15s ease",
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget.style.background = `${color}20`); }}
      onMouseLeave={e => { (e.currentTarget.style.background = `${color}10`); }}
    >
      {label}
    </button>
  );
}

function PagBtn({ label, active, disabled, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 12px", borderRadius: "7px", fontSize: "12px", fontWeight: 500,
        fontFamily: "var(--font-body)", cursor: disabled ? "not-allowed" : "pointer",
        background: active ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
        border: active ? "1px solid rgba(245,166,35,0.3)" : "1px solid rgba(255,255,255,0.07)",
        color: active ? "#f5a623" : "#64748b",
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {label}
    </button>
  );
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      {[...Array(cols)].map((_, i) => (
        <td key={i} style={{ padding: "14px 20px" }}>
          <div style={{ height: "14px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", animation: "shimmer 1.5s ease infinite" }} />
        </td>
      ))}
      <style>{`@keyframes shimmer{0%,100%{opacity:0.3}50%{opacity:0.7}}`}</style>
    </tr>
  );
}
