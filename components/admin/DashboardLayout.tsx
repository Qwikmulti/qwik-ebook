"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { label: "Overview",    href: "/admin/dashboard",             icon: "⊞" },
  { label: "Subscribers", href: "/admin/dashboard/subscribers", icon: "👥" },
  { label: "Ebook",       href: "/admin/dashboard/ebooks",      icon: "📚" },
  { label: "Settings",    href: "/admin/dashboard/settings",    icon: "⚙" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin");
  };

  const currentPage = navItems.find(n => n.href === pathname)?.label ?? "Dashboard";

  const Sidebar = () => (
    <aside style={{
      width: "240px", minWidth: "240px",
      background: "#0a0f1e",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column",
      height: "100vh",
      position: isMobile ? "fixed" : "sticky",
      top: 0, left: isMobile ? (sidebarOpen ? "0" : "-260px") : "0",
      zIndex: 100,
      transition: isMobile ? "left 0.3s cubic-bezier(0.4,0,0.2,1)" : "none",
    }}>
      {/* Brand */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🇬🇧</span>
            <div>
              <p style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600, margin: 0, fontFamily: "var(--font-body)" }}>UK Study Guide</p>
              <p style={{ color: "#334155", fontSize: "11px", margin: 0, fontFamily: "var(--font-body)" }}>Admin Panel</p>
            </div>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#475569", fontSize: "18px", cursor: "pointer", padding: "4px" }}>✕</button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "3px", overflowY: "auto" }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                display: "flex", alignItems: "center", gap: "11px",
                padding: "10px 12px", borderRadius: "10px",
                background: active ? "rgba(245,166,35,0.1)" : "transparent",
                border: active ? "1px solid rgba(245,166,35,0.18)" : "1px solid transparent",
                color: active ? "#f5a623" : "#64748b",
                fontSize: "14px", fontWeight: active ? 600 : 400,
                fontFamily: "var(--font-body)", cursor: "pointer",
                width: "100%", textAlign: "left",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}}
            >
              <span style={{ fontSize: "15px", width: "18px", textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {active && <span style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#f5a623", flexShrink: 0 }} />}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", marginBottom: "8px" }}>
          <div style={{
            width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#f5a623,#d4891a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "#0a0f1e",
          }}>
            {session?.user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div style={{ overflow: "hidden", minWidth: 0 }}>
            <p style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 500, margin: 0, fontFamily: "var(--font-body)" }}>Admin</p>
            <p style={{ color: "#334155", fontSize: "10px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
              {session?.user?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "9px 12px", width: "100%", borderRadius: "8px",
            background: "transparent", border: "1px solid rgba(239,68,68,0.15)",
            color: "#ef4444", fontSize: "13px", fontFamily: "var(--font-body)", cursor: "pointer",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ fontSize: "13px" }}>⏻</span> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#070d1a", display: "flex", fontFamily: "var(--font-body)" }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 99, backdropFilter: "blur(2px)" }}
        />
      )}

      <Sidebar />

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{
          height: "56px", background: "#0a0f1e",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center",
          padding: "0 20px", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 30,
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px", padding: "7px 10px", color: "#94a3b8",
                  fontSize: "16px", cursor: "pointer", lineHeight: 1,
                }}
              >
                ☰
              </button>
            )}
            <p style={{ color: "#e2e8f0", fontSize: "15px", fontWeight: 600, margin: 0, fontFamily: "var(--font-body)" }}>
              {currentPage}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#334155", fontSize: "12px", fontFamily: "var(--font-body)" }}>Live</span>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: "24px 20px", overflowY: "auto" }}>
          {children}
        </div>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
      `}</style>
    </div>
  );
}
