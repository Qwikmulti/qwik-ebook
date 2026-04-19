"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import type { Ebook } from "@/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<{ id: string, scope: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEbooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ebook/upload");
      const json = await res.json();
      if (json.success) setEbooks(json.data);
    } catch {
      toast.error("Failed to load ebooks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEbooks(); }, [fetchEbooks]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(".pdf", "").replace(/[_-]/g, " "));
    } else {
      toast.error("Only PDF files are accepted");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(".pdf", "").replace(/[_-]/g, " "));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select a PDF file");
    if (!title.trim()) return toast.error("Please enter an ebook title");

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress(p => Math.min(p + 8, 88));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title.trim());

      const res = await fetch("/api/admin/ebook/upload", { method: "POST", body: formData });
      const json = await res.json();

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (json.success) {
        toast.success("Ebook uploaded and set as active!");
        setSelectedFile(null);
        setTitle("");
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchEbooks();
      } else {
        toast.error(json.error);
        setUploadProgress(0);
      }
    } catch {
      clearInterval(progressInterval);
      toast.error("Upload failed. Please try again.");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (id: string) => {
    setActivatingId(id);
    try {
      const res = await fetch(`/api/admin/ebook/${id}`, { method: "PATCH" });
      const json = await res.json();
      if (json.success) { toast.success("Ebook set as active"); fetchEbooks(); }
      else toast.error(json.error);
    } catch {
      toast.error("Failed to activate ebook");
    } finally {
      setActivatingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This will remove it from storage permanently.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/ebook/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { toast.success("Ebook deleted"); fetchEbooks(); }
      else toast.error(json.error);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkSend = async (id: string, title: string, scope: "pending" | "all") => {
    const scopeLabel = scope === "pending" ? "pending subscribers" : "ALL subscribers";
    if (!confirm(`Send "${title}" to ${scopeLabel}?`)) return;

    setSendingId({ id, scope });
    try {
      const res = await fetch("/api/admin/subscribers/resend-pending", {
        method: "POST",
        body: JSON.stringify({ ebook_id: id, scope }),
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
      } else {
        toast.error(json.error || "Failed to send ebooks");
      }
    } catch {
      toast.error("An error occurred while sending");
    } finally {
      setSendingId(null);
    }
  };

  const activeEbook = ebooks.find(e => e.is_active);
  const formatSize = (file: File) => `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "#ffffff", margin: "0 0 6px", fontWeight: 700 }}>Ebook Management</h1>
          <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>Upload and manage the ebook sent to subscribers</p>
        </div>

        {/* Active ebook */}
        {activeEbook && (
          <div style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "14px", padding: "20px 24px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(34,197,94,0.12)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>📗</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <p style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: 0 }}>{activeEbook.title}</p>
                <span style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", padding: "2px 10px", color: "#4ade80", fontSize: "11px", fontWeight: 600 }}>ACTIVE</span>
              </div>
              <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>{activeEbook.file_name} · Uploaded {formatDate(activeEbook.uploaded_at)}</p>
            </div>
            <a
              href={activeEbook.file_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "8px 16px", color: "#94a3b8", fontSize: "13px", textDecoration: "none" }}
            >
              Preview ↗
            </a>
          </div>
        )}

        {/* Upload card */}
        <div style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "28px", marginBottom: "28px" }}>
          <h2 style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 600, margin: "0 0 20px", fontFamily: "var(--font-body)" }}>
            Upload New Ebook
          </h2>

          {/* Title input */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#64748b", fontSize: "12px", fontWeight: 500, marginBottom: "7px", letterSpacing: "0.04em" }}>EBOOK TITLE</label>
            <input
              type="text"
              placeholder="e.g. UK Study & Travel Guide 2026"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={uploading}
              style={{
                width: "100%", padding: "12px 14px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px", color: "#e2e8f0", fontSize: "14px",
                fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(245,166,35,0.4)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? "#f5a623" : selectedFile ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "12px",
              padding: "40px 24px",
              textAlign: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              background: dragOver ? "rgba(245,166,35,0.04)" : selectedFile ? "rgba(34,197,94,0.03)" : "rgba(255,255,255,0.01)",
              transition: "all 0.2s ease",
              marginBottom: "16px",
            }}
          >
            {selectedFile ? (
              <div>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>📄</div>
                <p style={{ color: "#4ade80", fontSize: "15px", fontWeight: 600, margin: "0 0 4px", fontFamily: "var(--font-body)" }}>{selectedFile.name}</p>
                <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 12px" }}>{formatSize(selectedFile)}</p>
                <button
                  onClick={e => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", padding: "5px 12px", color: "#f87171", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-body)" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📁</div>
                <p style={{ color: "#64748b", fontSize: "15px", fontWeight: 500, margin: "0 0 6px", fontFamily: "var(--font-body)" }}>
                  {dragOver ? "Drop your PDF here" : "Drag & drop your PDF here"}
                </p>
                <p style={{ color: "#334155", fontSize: "13px", margin: "0 0 12px" }}>or click to browse · PDF only · Max 50MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} style={{ display: "none" }} />
          </div>

          {/* Progress bar */}
          {uploading && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#64748b", fontSize: "12px" }}>Uploading to Supabase Storage...</span>
                <span style={{ color: "#f5a623", fontSize: "12px", fontWeight: 600 }}>{uploadProgress}%</span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${uploadProgress}%`, background: "linear-gradient(90deg,#f5a623,#d4891a)", borderRadius: "2px", transition: "width 0.3s ease" }} />
              </div>
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !title.trim() || uploading}
            style={{
              padding: "13px 28px",
              background: !selectedFile || !title.trim() || uploading ? "rgba(245,166,35,0.2)" : "linear-gradient(135deg,#f5a623,#d4891a)",
              color: "#0a0f1e", border: "none", borderRadius: "10px",
              fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-body)",
              cursor: !selectedFile || !title.trim() || uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Upload & Set as Active →"}
          </button>
        </div>

        {/* History table */}
        <div style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h2 style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: 0 }}>Upload History</h2>
          </div>

          {loading ? (
            <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: "20px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", animation: "shimmer 1.5s ease infinite" }} />
              ))}
            </div>
          ) : ebooks.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
              <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>No ebooks uploaded yet</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["Title", "File", "Uploaded", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "#334155", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ebooks.map((eb, i) => (
                    <tr
                      key={eb.id}
                      style={{ borderBottom: i < ebooks.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 20px", color: "#e2e8f0", fontSize: "14px", fontWeight: 500 }}>{eb.title}</td>
                      <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "12px" }}>{eb.file_name}</td>
                      <td style={{ padding: "14px 20px", color: "#475569", fontSize: "12px", whiteSpace: "nowrap" }}>{formatDate(eb.uploaded_at)}</td>
                      <td style={{ padding: "14px 20px" }}>
                        {eb.is_active ? (
                          <span style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", padding: "3px 10px", color: "#4ade80", fontSize: "11px", fontWeight: 600 }}>Active</span>
                        ) : (
                          <span style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px", padding: "3px 10px", color: "#475569", fontSize: "11px" }}>Inactive</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <a href={eb.file_url} target="_blank" rel="noopener noreferrer" style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "6px", padding: "5px 11px", color: "#60a5fa", fontSize: "12px", textDecoration: "none" }}>
                            View ↗
                          </a>
                          {!eb.is_active && (
                            <button
                              onClick={() => handleActivate(eb.id)}
                              disabled={activatingId === eb.id}
                              style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: "6px", padding: "5px 11px", color: "#f5a623", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-body)", opacity: activatingId === eb.id ? 0.5 : 1 }}
                            >
                              {activatingId === eb.id ? "..." : "Set Active"}
                            </button>
                          )}
                          <button
                            onClick={() => handleBulkSend(eb.id, eb.title, "pending")}
                            disabled={sendingId !== null}
                            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "6px", padding: "5px 11px", color: "#a855f7", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-body)", opacity: sendingId !== null ? 0.5 : 1 }}
                            title="Send to users who haven't received an ebook yet"
                          >
                            {sendingId?.id === eb.id && sendingId.scope === "pending" ? "..." : "Send to Pending"}
                          </button>
                          <button
                            onClick={() => handleBulkSend(eb.id, eb.title, "all")}
                            disabled={sendingId !== null}
                            style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: "6px", padding: "5px 11px", color: "#ec4899", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-body)", opacity: sendingId !== null ? 0.5 : 1 }}
                            title="Send to every single subscriber"
                          >
                            {sendingId?.id === eb.id && sendingId.scope === "all" ? "..." : "Send to All"}
                          </button>
                          <button
                            onClick={() => handleDelete(eb.id, eb.title)}
                            disabled={deletingId === eb.id}
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "6px", padding: "5px 11px", color: "#f87171", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-body)", opacity: deletingId === eb.id ? 0.5 : 1 }}
                          >
                            {deletingId === eb.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>{`input::placeholder{color:#334155} @keyframes shimmer{0%,100%{opacity:0.3}50%{opacity:0.7}}`}</style>
    </DashboardLayout>
  );
}
