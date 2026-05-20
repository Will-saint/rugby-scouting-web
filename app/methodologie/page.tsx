import Link from "next/link"

const PIPELINE = [
  { step: "01", label: "Collecte LNR",        desc: "Scraping des pages clubs top14.lnr.fr — 11 champs publics par joueur (plaquages, offloads, franchissements, turnovers, points, essais, cartons, minutes, matchs)." },
  { step: "02", label: "Normalisation",        desc: "Conversion en stats par 80 minutes (pro-rata du temps joué). Ajout du profil physique (taille, poids) depuis les fiches LNR individuelles." },
  { step: "03", label: "Scoring par poste",    desc: "Min-max sur le percentile 5–95 par groupe de poste. Score brut = Σ(métrique normalisée × poids). Poids différents pour chaque poste." },
  { step: "04", label: "Confiance",            desc: "Coefficient selon le temps joué : ≥600 min → 1.0 | ≥300 → 0.75 | ≥150 → 0.60 | <150 → 0.50. Ramène la note vers 50 si sample faible." },
  { step: "05", label: "Malus discipline",     desc: "Appliqué après le score : −2 pts par carton jaune, −3 orange, −8 rouge. Plafonné à −10 pts au total." },
  { step: "06", label: "Bonus âge + intl",     desc: "Courbe de Gauss centrée sur l'âge optimal du poste (±2 pts). Bonus international 0–5 pts selon le niveau de la sélection." },
  { step: "07", label: "Blend forme",          desc: "Note finale = 80% note_brute + 20% forme (5 derniers matchs). La forme est calculée sur une fenêtre glissante de matchs individuels." },
]

const AXES = [
  { label: "Attaque",     color: "#F97316", icon: "⚡", desc: "Essais, franchissements, offloads, points inscrits", postes: "Ailier, Centre, Arrière" },
  { label: "Défense",     color: "#3B82F6", icon: "🛡", desc: "Plaquages réussis, ballons récupérés", postes: "3e ligne, 1e ligne, Demi de mêlée" },
  { label: "Contrôle",    color: "#10B981", icon: "🎯", desc: "Passes, continuité, efficacité de jeu", postes: "9, 10, Centre" },
  { label: "Jeu au pied", color: "#8B5CF6", icon: "🦵", desc: "Points au pied, mètres kicks, coups de pied", postes: "10, 15" },
  { label: "Puissance",   color: "#EF4444", icon: "💪", desc: "Portées, impacts, mètres parcourus", postes: "1e ligne, 2e ligne" },
  { label: "Physique",    color: "#F59E0B", icon: "📏", desc: "Indice corporel normalisé par poste (taille × poids)", postes: "2e ligne, 1e ligne" },
  { label: "Discipline",  color: "#6B7280", icon: "🟡", desc: "Inverse des cartons — 100 = aucun carton", postes: "Tous postes" },
]

const POS_WEIGHTS: { pos: string; weights: { stat: string; pct: number }[] }[] = [
  { pos: "1ère ligne", weights: [{ stat: "Plaquages", pct: 35 }, { stat: "Turnovers", pct: 20 }, { stat: "Offloads", pct: 10 }, { stat: "Gabarit", pct: 25 }, { stat: "Autres", pct: 10 }] },
  { pos: "2ème ligne", weights: [{ stat: "Plaquages", pct: 30 }, { stat: "Turnovers", pct: 25 }, { stat: "Offloads", pct: 15 }, { stat: "Taille", pct: 10 }, { stat: "Autres", pct: 20 }] },
  { pos: "3ème ligne", weights: [{ stat: "Plaquages", pct: 30 }, { stat: "Turnovers", pct: 30 }, { stat: "Offloads", pct: 15 }, { stat: "Essais", pct: 10 }, { stat: "Autres", pct: 15 }] },
  { pos: "Demi de mêlée", weights: [{ stat: "Offloads", pct: 25 }, { stat: "Essais", pct: 15 }, { stat: "Turnovers", pct: 20 }, { stat: "Franchiss.", pct: 10 }, { stat: "Autres", pct: 30 }] },
  { pos: "Demi d'ouv.", weights: [{ stat: "Jeu pied", pct: 20 }, { stat: "Franchiss.", pct: 20 }, { stat: "Essais", pct: 20 }, { stat: "Offloads", pct: 18 }, { stat: "Autres", pct: 22 }] },
]

const TIERS = [
  { label: "LÉGENDAIRE", range: "≥ 90", color: "#d4af37", desc: "Niveau international élite — Dupont, Kolbe, Van der Flier" },
  { label: "OR",         range: "84–89", color: "#c89d4a", desc: "Très haut niveau, titulaire en sélection nationale" },
  { label: "ARGENT",     range: "77–83", color: "#1a3a2e", desc: "Cadre Top 14, potentiel international" },
  { label: "BRONZE",     range: "70–76", color: "#b94f3a", desc: "Joueur confirmé, titulaire régulier" },
  { label: "STANDARD",   range: "< 70",  color: "#5a5a4e", desc: "Remplaçant, jeune en développement" },
]

const SOURCES = [
  { name: "LNR / top14.lnr.fr",  type: "Officiel",      desc: "11 stats publiques sans login. Carries, mètres et passes restent derrière le paywall MyRugby." },
  { name: "ESPN (via Naim)",      type: "International", desc: "34 906 matchs internationaux (2016–2023). 171 joueurs Top 14 matchés sur lnr_slug." },
  { name: "Rugbypass.com",        type: "Complément",    desc: "Top 5 pour 4 catégories (essais, plaquages, kicks, points). Source principale pour les photos de profil." },
]

export default function MethodologiePage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0" }}>

      {/* Header */}
      <div className="px-6 sm:px-12 pt-14 pb-10 border-b" style={{ borderColor: "var(--color-line)" }}>
        <p className="font-mono text-xs mb-3 tracking-wider" style={{ color: "var(--color-terra)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em" }}>
          DOCUMENTATION
        </p>
        <h1 className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 52, fontWeight: 400, lineHeight: 1, color: "var(--color-ink)" }}>
          Méthodo<em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>logie</em>
        </h1>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-muted)", maxWidth: 560 }}>
          Système de notation inspiré des modèles FIFA/UEFA, adapté au rugby union. Chaque joueur reçoit une note entre 40 et 99 calculée uniquement à partir de stats observables — pas de subjectivité.
        </p>
      </div>

      <div className="px-6 sm:px-12 py-10 space-y-16">

        {/* Pipeline */}
        <section>
          <h2 className="font-serif mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, color: "var(--color-ink)" }}>
            Pipeline de calcul
          </h2>
          <div className="space-y-0">
            {PIPELINE.map(({ step, label, desc }, i) => (
              <div key={step} className="flex gap-5 group">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-semibold"
                    style={{ background: "var(--color-forest)", color: "var(--color-paper)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {step}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: "var(--color-line)" }} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-7 flex-1">
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--color-ink)" }}>{label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Formule */}
        <section>
          <h2 className="font-serif mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, color: "var(--color-ink)" }}>
            Formule
          </h2>
          <div className="rounded-xl p-6 border overflow-x-auto" style={{ background: "var(--color-forest)", borderColor: "var(--color-forest)" }}>
            <code className="text-sm block mb-4" style={{ color: "var(--color-paper)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 2 }}>
              <span style={{ color: "#4ade80" }}>note_brute</span> = clip(40 + 0.6 × score_raw, 40, 99)<br />
              <span style={{ color: "#4ade80" }}>note_confiance</span> = conf × score_raw + (1−conf) × 50<br />
              <span style={{ color: "#fbbf24" }}>note_finale</span> = clip(40 + 0.6 × note_confiance − malus_cartons, 40, 99)
            </code>
            <div className="text-xs space-y-1" style={{ color: "rgba(243,237,224,0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
              <div>score_raw = Σ(métrique_normalisée × poids_poste) → [0, 100]</div>
              <div>conf ∈ &#123; 1.00 ≥600 min | 0.75 ≥300 | 0.60 ≥150 | 0.50 &lt;150 &#125;</div>
              <div>malus = 2×YC + 3×OC + 8×RC, plafonné à 10</div>
            </div>
          </div>
        </section>

        {/* 7 axes */}
        <section>
          <h2 className="font-serif mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, color: "var(--color-ink)" }}>
            Les 7 axes d&apos;évaluation
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {AXES.map(({ label, color, icon, desc, postes }) => (
              <div key={label} className="rounded-xl p-4 border flex gap-3" style={{ background: "var(--color-paper)", borderColor: "var(--color-line)" }}>
                <div className="w-1 rounded-full shrink-0 mt-1" style={{ backgroundColor: color, minHeight: 40 }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{icon}</span>
                    <span className="font-semibold text-sm" style={{ color: "var(--color-ink)" }}>{label}</span>
                  </div>
                  <p className="text-xs leading-relaxed mb-1" style={{ color: "var(--color-muted)" }}>{desc}</p>
                  <p className="text-xs font-mono" style={{ color: color, fontFamily: "'JetBrains Mono', monospace" }}>→ {postes}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Poids par poste */}
        <section>
          <h2 className="font-serif mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, color: "var(--color-ink)" }}>
            Poids par poste
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
            Un pilier n&apos;est pas évalué sur les mêmes critères qu&apos;un demi d&apos;ouverture. Les poids sont fixés manuellement selon les attentes par position.
          </p>
          <div className="space-y-4">
            {POS_WEIGHTS.map(({ pos, weights }) => (
              <div key={pos} className="rounded-xl p-4 border" style={{ background: "var(--color-paper)", borderColor: "var(--color-line)" }}>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-ink)" }}>{pos}</p>
                <div className="flex gap-1 h-5 rounded-full overflow-hidden">
                  {weights.map(({ stat, pct }, i) => {
                    const colors = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6", "#94a3b8"]
                    return (
                      <div key={stat} style={{ width: `${pct}%`, background: colors[i], position: "relative" }}
                        title={`${stat} ${pct}%`} />
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {weights.map(({ stat, pct }, i) => {
                    const colors = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6", "#94a3b8"]
                    return (
                      <span key={stat} className="text-xs font-mono flex items-center gap-1" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: colors[i] }} />
                        {stat} {pct}%
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tiers */}
        <section>
          <h2 className="font-serif mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, color: "var(--color-ink)" }}>
            Tiers de qualité
          </h2>
          <div className="space-y-2">
            {TIERS.map(({ label, range, color, desc }) => (
              <div key={label} className="rounded-xl p-4 border flex items-center gap-4" style={{ background: "var(--color-paper)", borderColor: "var(--color-line)" }}>
                <div className="shrink-0 w-32">
                  <span className="font-mono font-bold text-xs px-2 py-1 rounded" style={{ background: `${color}18`, color, border: `1px solid ${color}40`, letterSpacing: "0.08em" }}>
                    {label}
                  </span>
                  <p className="font-mono text-xs mt-1" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace" }}>{range} / 99</p>
                </div>
                <div className="w-px h-8" style={{ background: "var(--color-line)" }} />
                <p className="text-sm" style={{ color: "var(--color-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources */}
        <section>
          <h2 className="font-serif mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, color: "var(--color-ink)" }}>
            Sources de données
          </h2>
          <div className="space-y-3">
            {SOURCES.map(({ name, type, desc }) => (
              <div key={name} className="rounded-xl p-4 border flex gap-4" style={{ background: "var(--color-paper)", borderColor: "var(--color-line)" }}>
                <div className="shrink-0 w-36">
                  <p className="font-semibold text-sm" style={{ color: "var(--color-ink)" }}>{name}</p>
                  <span className="font-mono text-xs" style={{ color: "var(--color-terra)", fontFamily: "'JetBrains Mono', monospace" }}>{type}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Limites */}
        <section>
          <h2 className="font-serif mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, color: "var(--color-ink)" }}>
            Limites connues
          </h2>
          <div className="rounded-xl p-6 border space-y-3" style={{ background: "var(--color-paper)", borderColor: "var(--color-line)" }}>
            {[
              "Carries, mètres et passes derrière le paywall MyRugby LNR — pas disponibles sans abonnement",
              "Joueurs < 150 min jouées : note peu fiable, badge confiance « Basse »",
              "Pas de prise en compte du leadership, du QI rugby ou des qualités non-statistiques",
              "La note internationale (ESPN 2016–2023) peut être obsolète pour les joueurs récemment sélectionnés",
              "Statbunker (source complémentaire prévue) périodiquement indisponible",
            ].map((l, i) => (
              <div key={i} className="flex gap-3 text-sm" style={{ color: "var(--color-muted)" }}>
                <span style={{ color: "var(--color-terra)", marginTop: 2 }}>·</span>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Back */}
        <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: "var(--color-line)" }}>
          <Link href="/" className="text-sm transition-colors" style={{ color: "var(--color-muted)" }}>
            ← Retour à l&apos;accueil
          </Link>
          <Link href="/leaderboard" className="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            style={{ background: "var(--color-forest)", color: "var(--color-paper)" }}>
            Voir le classement →
          </Link>
        </div>

      </div>
    </div>
  )
}
