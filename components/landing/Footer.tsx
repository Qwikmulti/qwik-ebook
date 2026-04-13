"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "#020817",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "48px 24px 32px",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Top row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "32px",
          marginBottom: "40px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "28px" }}>🇬🇧</span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                color: "#ffffff",
                fontWeight: 700,
              }}>
                UK Study Guide
              </span>
            </div>
            <p style={{
              color: "#475569",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
              margin: 0,
              maxWidth: "280px",
              lineHeight: 1.65,
            }}>
              Your trusted resource for everything you need to study and thrive in the United Kingdom.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "#64748b", fontSize: "11px", fontFamily: "var(--font-body)", margin: "0 0 14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Guide Topics
              </p>
              {["University Admissions", "Student Visa", "Accommodation", "Cost of Living", "Working in the UK"].map((link) => (
                <div key={link} style={{ marginBottom: "10px" }}>
                  <a
                    href="#register"
                    onClick={(e) => { e.preventDefault(); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }}
                    style={{
                      color: "#475569",
                      fontSize: "14px",
                      fontFamily: "var(--font-body)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = "#f5a623"}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = "#475569"}
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>

            <div>
              <p style={{ color: "#64748b", fontSize: "11px", fontFamily: "var(--font-body)", margin: "0 0 14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Connect
              </p>
              {[
                { name: "Twitter / X", href: "#" },
                { name: "Instagram", href: "#" },
                { name: "YouTube", href: "#" },
                { name: "Contact Us", href: "#" },
              ].map((link) => (
                <div key={link.name} style={{ marginBottom: "10px" }}>
                  <a
                    href={link.href}
                    style={{
                      color: "#475569",
                      fontSize: "14px",
                      fontFamily: "var(--font-body)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = "#f5a623"}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = "#475569"}
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div style={{
          background: "rgba(245,166,35,0.06)",
          border: "1px solid rgba(245,166,35,0.15)",
          borderRadius: "16px",
          padding: "24px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "40px",
        }}>
          <div>
            <p style={{ color: "#e2e8f0", fontSize: "16px", fontWeight: 600, fontFamily: "var(--font-body)", margin: "0 0 4px" }}>
              Still haven&apos;t grabbed your free guide?
            </p>
            <p style={{ color: "#64748b", fontSize: "13px", fontFamily: "var(--font-body)", margin: 0 }}>
              Join 10,000+ students who are already prepared for UK life.
            </p>
          </div>
          <button
            onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "linear-gradient(135deg, #f5a623, #d4891a)",
              color: "#0a0f1e",
              border: "none",
              borderRadius: "10px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Get Free Guide →
          </button>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}>
          <p style={{ color: "#334155", fontSize: "13px", fontFamily: "var(--font-body)", margin: 0 }}>
            © {year} UK Study Guide. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy Policy", "Terms of Use"].map((t) => (
              <a
                key={t}
                href="#"
                style={{ color: "#334155", fontSize: "12px", fontFamily: "var(--font-body)", textDecoration: "none" }}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
