export default function LabPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        color: "var(--text)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 2rem",
        fontFamily: "var(--font-body), sans-serif",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-faded)",
          marginBottom: "1.5rem",
        }}
      >
        Aether Labs — Lab
      </p>

      <h1
        style={{
          fontFamily: "var(--font-display), serif",
          fontWeight: 300,
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          color: "var(--text)",
          marginBottom: "3rem",
          letterSpacing: "-0.01em",
          textAlign: "center",
        }}
      >
        Experimentos
      </h1>

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
        }}
      >
        {/* Sketchfab embed */}
        <section
          style={{
            border: "1px solid var(--stroke)",
            borderRadius: "4px",
            overflow: "hidden",
            background: "var(--bg-soil)",
          }}
        >
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--stroke)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-sage)",
              }}
            >
              3D / Sketchfab
            </span>
            <span
              style={{
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
              }}
            >
              DENDY JUNIOR
            </span>
          </div>

          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              title="DENDY JUNIOR"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              src="https://sketchfab.com/models/63db6f93a9eb47518093a9fe15b9cccb/embed"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </section>
      </div>

      <nav
        style={{
          marginTop: "4rem",
          fontFamily: "var(--font-body), sans-serif",
          fontSize: "0.75rem",
          color: "var(--text-faded)",
        }}
      >
        <a href="/" style={{ color: "var(--accent-sage)", textDecoration: "none" }}>
          ← Volver
        </a>
      </nav>
    </main>
  );
}
