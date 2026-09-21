"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#04070d",
          color: "#eaf0f8",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
            Da ist etwas schiefgelaufen
          </h1>
          <p style={{ color: "#b3c0d4", marginBottom: "1.5rem", maxWidth: "32rem" }}>
            Bitte laden Sie die Seite neu. Wenn es weiterhin nicht klappt, erreichen Sie uns
            telefonisch unter 0172 7312531.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              minHeight: "3rem",
              padding: "0.8rem 1.5rem",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#ff9522",
              color: "#21120a",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Neu laden
          </button>
        </div>
      </body>
    </html>
  );
}
