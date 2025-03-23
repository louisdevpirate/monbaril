"use client";

export default function SuccessPage() {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎉 Merci pour votre commande !</h1>
        <p style={{ color: "#555", maxWidth: "600px", margin: "0 auto" }}>
          Votre baril personnalisable est en route vers votre espace. 
          Vous recevrez un message dès qu’il sera prêt à être récupéré ou expédié.
        </p>
  
        <div style={{ marginTop: "2rem" }}>
          <a
            href="/products"
            style={{
              display: "inline-block",
              backgroundColor: "black",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Explorer d’autres barils
          </a>
        </div>
      </div>
    );
  }
  