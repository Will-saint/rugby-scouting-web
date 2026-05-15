import Link from "next/link"
import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { RatingBar } from "@/components/RatingBar"

export const revalidate = 300

async function getMeta() {
  try { return await api.meta() } catch { return null }
}
async function getTop5() {
  try {
    const r = await api.leaderboard({ limit: 5 })
    return r
  } catch { return [] }
}

export default async function HomePage() {
  const [meta, top5] = await Promise.all([getMeta(), getTop5()])

  const cards = [
    { href: "/leaderboard",  icon: "🏆", label: "Classement",    desc: "Top 544 joueurs par note, filtrable par poste et équipe" },
    { href: "/compare",      icon: "⚡", label: "Comparateur",   desc: "Radar superposé · tableau métrique · verdict de recrutement" },
    { href: "/composition",  icon: "📋", label: "Compo XV",      desc: "Construis ton XV idéal · score collectif · radar d'équipe" },
    { href: "/team",         icon: "🛡️", label: "Équipes",       desc: "Force par club, distribution des tiers, évolution saisons" },
    { href: "/predict",      icon: "🎯", label: "Prédicteur",    desc: "Probabilité de victoire basée sur les notes des effectifs" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Rugby Analytics
          <span className="text-orange-400"> Dashboard</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Analyse de données pour le Top 14 · Notation FIFA-style · 6 saisons historiques
        </p>
        {meta && (
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {[
              { label: "Joueurs scorés", value: meta.n_players },
              { label: "Clubs", value: meta.n_teams },
              { label: "Note moyenne", value: meta.avg_rating },
              { label: "Saisons", value: 6 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-orange-400">{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top 5 */}
      {top5.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Top 5 joueurs</h2>
          <div className="grid gap-3">
            {top5.map((p) => (
              <Link
                key={p.lnr_slug}
                href={`/player/${p.lnr_slug}`}
                className="flex items-center gap-4 p-4 rounded-lg border transition-colors hover:border-orange-500/50 hover:bg-orange-500/5"
                style={{ background: "#111827", borderColor: "#1e2d42" }}
              >
                <span className="text-2xl font-bold text-slate-600 w-8 text-center">#{p.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white truncate">{p.name}</span>
                    <TierBadge tier={p.tier} size="xs" />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{p.team} · {p.position_group}</div>
                  <RatingBar rating={p.rating} tier={p.tier} size="sm" />
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold text-orange-400">{p.rating}</div>
                  <div className="text-xs text-slate-500">{p.form_trend}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Modules */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Explorer</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ href, icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="p-5 rounded-xl border flex flex-col gap-2 transition-all hover:border-orange-500/50 hover:bg-orange-500/5 group"
              style={{ background: "#111827", borderColor: "#1e2d42" }}
            >
              <span className="text-3xl">{icon}</span>
              <span className="font-semibold text-white group-hover:text-orange-400 transition-colors">{label}</span>
              <span className="text-xs text-slate-500 leading-relaxed">{desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
