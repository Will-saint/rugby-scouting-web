import Link from "next/link"

const AXES = [
  { key: "axis_att",     label: "Attaque",      color: "#F97316", desc: "Essais, franchissements, offloads, points inscrits" },
  { key: "axis_def",     label: "Défense",      color: "#3B82F6", desc: "Plaquages réussis, ballons récupérés, plaquages ratés" },
  { key: "axis_ctrl",    label: "Contrôle",     color: "#10B981", desc: "Passes, continuité, soutien ruck, efficacité générale" },
  { key: "axis_kick",    label: "Jeu au pied",  color: "#8B5CF6", desc: "Points au pied, mètres kicks, coups de pied en jeu" },
  { key: "axis_pow",     label: "Puissance",    color: "#EF4444", desc: "Mètres parcourus, portées, impacts en défense" },
  { key: "axis_gabarit", label: "Physique",     color: "#F59E0B", desc: "Indice corporel (taille × poids) normalisé par poste" },
  { key: "axis_disc",    label: "Discipline",   color: "#6B7280", desc: "Cartons jaunes (−3), orange (−6), rouges (−10)" },
]

const TIERS = [
  { label: "LEGENDAIRE", range: "≥ 90",     color: "#FFD700", bg: "rgba(255,215,0,0.1)",     border: "rgba(255,215,0,0.3)",     desc: "Niveau international élite — top mondial" },
  { label: "OR",         range: "84 – 89",  color: "#C8A840", bg: "rgba(200,168,64,0.1)",    border: "rgba(200,168,64,0.3)",    desc: "Joueur de très haut niveau, titulaire en équipe nationale" },
  { label: "ARGENT",     range: "77 – 83",  color: "#4CAF50", bg: "rgba(76,175,80,0.08)",    border: "rgba(76,175,80,0.25)",    desc: "Cadre de son club, potentiel international" },
  { label: "BRONZE",     range: "70 – 76",  color: "#FF7043", bg: "rgba(255,112,67,0.08)",   border: "rgba(255,112,67,0.25)",   desc: "Joueur confirmé Top 14, titulaire régulier" },
  { label: "STANDARD",   range: "< 70",     color: "#78909C", bg: "rgba(120,144,156,0.08)",  border: "rgba(120,144,156,0.2)",   desc: "Joker, remplaçant ou joueur en développement" },
]

const POS_WEIGHTS = [
  { pos: "Pilier / Talonneur",   pg: "FRONT_ROW",  w: "1.0", detail: "Plaquages, mêlée, portées courtes" },
  { pos: "2ème ligne",           pg: "LOCK",        w: "1.0", detail: "Puissance, touche, plaquages" },
  { pos: "3ème ligne",           pg: "BACK_ROW",    w: "1.1", detail: "Polyvalence attaque/défense, turnovers" },
  { pos: "Demi de mêlée",        pg: "SCRUM_HALF",  w: "1.2", detail: "Passes, kicks, gestion du jeu" },
  { pos: "Demi d'ouverture",     pg: "FLY_HALF",    w: "1.3", detail: "Points au pied, décision, leadership" },
  { pos: "Centre",               pg: "CENTRE",      w: "1.1", detail: "Franchissements, défense, passes" },
  { pos: "Ailier",               pg: "WINGER",      w: "1.0", detail: "Essais, mètres, vitesse" },
  { pos: "Arrière",              pg: "FULLBACK",    w: "1.2", detail: "Jeu au pied, contre-attaque, solidité" },
]

export default function MethodologiePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📐</span>
          <h1 className="text-2xl font-bold text-white">Méthodologie de notation</h1>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Système de notation FIFA-style adapté au rugby. Chaque joueur reçoit une note entre 40 et 99 basée sur ses performances statistiques en Top 14.
        </p>
      </div>

      {/* Formule */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white border-b pb-2" style={{ borderColor: "#1E3050" }}>Formule générale</h2>
        <div className="rounded-xl p-6 border font-mono text-sm" style={{ background: "#0F1A2E", borderColor: "#1E3050" }}>
          <div className="text-orange-400 font-bold mb-3">note_finale = note_brute × âge_factor + bonus_intl + blend_forme</div>
          <div className="space-y-1 text-slate-400 text-xs">
            <div><span className="text-slate-300">note_brute</span> = moyenne pondérée des 7 axes (normalisés 0–100)</div>
            <div><span className="text-slate-300">âge_factor</span> = courbe de Gauss centrée sur l&apos;âge optimal du poste</div>
            <div><span className="text-slate-300">bonus_intl</span> = 0 à +5 pts selon le niveau de la sélection nationale</div>
            <div><span className="text-slate-300">blend_forme</span> = 80% note_brute + 20% forme_5_matchs</div>
          </div>
        </div>
      </section>

      {/* 7 axes */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white border-b pb-2" style={{ borderColor: "#1E3050" }}>Les 7 axes d&apos;évaluation</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {AXES.map(({ label, color, desc }) => (
            <div key={label} className="rounded-xl p-4 border flex gap-3" style={{ background: "#0F1A2E", borderColor: "#1E3050" }}>
              <div className="w-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <div>
                <div className="font-semibold text-white text-sm">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Poids par poste */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white border-b pb-2" style={{ borderColor: "#1E3050" }}>Poids par poste</h2>
        <p className="text-slate-400 text-sm">Les axes ne sont pas pondérés de la même façon selon le poste. Un pilier n&apos;est pas évalué sur les mêmes critères qu&apos;un demi d&apos;ouverture.</p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#1E3050" }}>
          <table className="w-full text-sm">
            <thead style={{ background: "#08111F" }}>
              <tr className="text-left text-slate-600 text-xs uppercase tracking-wider">
                <th className="px-4 py-3">Poste</th>
                <th className="px-4 py-3 hidden sm:table-cell">Groupe</th>
                <th className="px-4 py-3 text-center">Poids</th>
                <th className="px-4 py-3 hidden md:table-cell">Axes prioritaires</th>
              </tr>
            </thead>
            <tbody>
              {POS_WEIGHTS.map(({ pos, pg, w, detail }) => (
                <tr key={pg} className="border-t" style={{ borderColor: "#162236" }}>
                  <td className="px-4 py-3 font-medium text-white">{pos}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">{pg}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-orange-400">{w}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tiers */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white border-b pb-2" style={{ borderColor: "#1E3050" }}>Tiers de qualité</h2>
        <div className="space-y-3">
          {TIERS.map(({ label, range, color, bg, border, desc }) => (
            <div key={label} className="rounded-xl p-4 border flex items-center gap-4" style={{ background: bg, borderColor: border }}>
              <div className="shrink-0 text-right w-28">
                <div className="font-bold text-sm" style={{ color }}>{label}</div>
                <div className="text-xs" style={{ color: color + "99" }}>{range}</div>
              </div>
              <div className="w-px h-8 rounded" style={{ backgroundColor: border }} />
              <div className="text-sm text-slate-300">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Forme */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white border-b pb-2" style={{ borderColor: "#1E3050" }}>Indicateur de forme</h2>
        <div className="rounded-xl p-5 border space-y-3" style={{ background: "#0F1A2E", borderColor: "#1E3050" }}>
          <p className="text-slate-400 text-sm">La forme est calculée sur les 5 et 10 derniers matchs joués (fenêtre glissante). Elle impacte à 20% la note finale.</p>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div><div className="text-green-400 font-bold">↗</div><div className="text-slate-500 text-xs mt-0.5">En progression</div></div>
            <div><div className="text-slate-400 font-bold">→</div><div className="text-slate-500 text-xs mt-0.5">Stable</div></div>
            <div><div className="text-red-400 font-bold">↘</div><div className="text-slate-500 text-xs mt-0.5">En baisse</div></div>
          </div>
        </div>
      </section>

      {/* Limites */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white border-b pb-2" style={{ borderColor: "#1E3050" }}>Limites connues</h2>
        <div className="rounded-xl p-5 border space-y-2" style={{ background: "#0F1A2E", borderColor: "#1E3050" }}>
          {[
            "Certaines statistiques (métrages, passes) sont derrière le paywall MyRugby LNR et ne sont pas disponibles",
            "Les joueurs avec peu de minutes jouées (< 100 min) ont une note moins fiable — badge confiance 'Basse'",
            "Le système ne tient pas compte des tactiques d'équipe ni du leadership non-statistique",
            "La note internationale est basée sur les stats des compétitions internationales récentes (6 Nations, Rugby Championship...)",
          ].map((l, i) => (
            <div key={i} className="flex gap-2 text-sm text-slate-400">
              <span className="text-orange-400 shrink-0">·</span>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-4 border-t text-center" style={{ borderColor: "#1E3050" }}>
        <Link href="/" className="text-sm text-slate-500 hover:text-orange-400 transition-colors">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
