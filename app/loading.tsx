export default function Loading() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f1e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "16px",
    }}>
      <div style={{
        width: "40px", height: "40px",
        border: "2px solid rgba(245,166,35,0.15)",
        borderTopColor: "#f5a623",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <p style={{ color: "#334155", fontSize: "13px", fontFamily: "var(--font-body)", margin: 0 }}>
        Loading...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
