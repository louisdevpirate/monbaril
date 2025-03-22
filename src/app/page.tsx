import Link from "next/link";

export default function HomePage() {
    return (
      <div className="space-y-24 p-8">
        <section>
          <h1 className="text-4xl font-bold">🔥 MonBaril — Faites le plein de style</h1>
          <p className="mt-4 text-lg text-gray-600">Des barils décoratifs uniques, inspirés par la course, l'art, le vintage ou l'industrie.</p>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold">Top Sellers</h2>
          <div className="mt-4 bg-gray-100 h-40 flex items-center justify-center rounded">[GRID PLACEHOLDER]</div>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold">Explorer les Catégories</h2>
          <div className="mt-4 bg-gray-100 h-40 flex items-center justify-center rounded"><Link href="/categories" style={{ marginTop: "2rem", display: "inline-block" }}>
  → Voir toutes les catégories
</Link></div>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold">Nouveautés</h2>
          <div className="mt-4 bg-gray-100 h-40 flex items-center justify-center rounded">[NOUVEAUTÉS PLACEHOLDER]</div>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold">Pourquoi MonBaril ?</h2>
          <div className="mt-4 bg-gray-100 h-40 flex items-center justify-center rounded">[WHY US PLACEHOLDER]</div>
        </section>
      </div>
    )
  }
  