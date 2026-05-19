export function Footer() {
  return (
    <footer className="border-t mt-20" style={{ borderColor: "var(--color-line)" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 grid sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <p className="font-serif italic text-lg mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--color-ink)" }}>
            Rugby Analytics
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
            Dashboard indépendant d'analyse des joueurs du Top 14. Non affilié à la LNR.
          </p>
        </div>

        {/* Sources */}
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}>
            Sources de données
          </p>
          <ul className="text-xs space-y-1.5" style={{ color: "var(--color-muted)" }}>
            <li>· LNR / top14.lnr.fr — stats officielles Top 14</li>
            <li>· ESPN (via données publiques) — stats internationales</li>
            <li>· Rugbypass.com — statistiques complémentaires</li>
          </ul>
        </div>

        {/* Légal */}
        <div>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-muted)", letterSpacing: "0.1em" }}>
            Mentions légales
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
            Les données affichées (noms, photos, statistiques) sont des données publiques issues de sources officielles, utilisées à des fins d'analyse sportive non commerciale. Aucune donnée utilisateur n'est collectée. Conformément au RGPD, base légale : intérêt légitime (art. 6.1.f).
          </p>
        </div>
      </div>

      <div className="border-t px-6 sm:px-12 py-4 flex items-center justify-between" style={{ borderColor: "var(--color-line)" }}>
        <p className="text-xs font-mono" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
          © 2026 Rugby Analytics · Saison 2025-2026
        </p>
        <p className="text-xs font-mono hidden sm:block" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
          Propulsé par Claude Haiku · Données LNR
        </p>
      </div>
    </footer>
  )
}
