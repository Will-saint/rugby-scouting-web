import Link from "next/link"
import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { RatingBar } from "@/components/RatingBar"

export const revalidate = 300

async function getMeta() {
  try { return await api.meta() } catch { return null }
}
async function getTop5() {
  try { return await api.leaderboard({ limit: 5 }) } catch { return [] }
}

const cards = [
  { href: "/leaderboard",   icon: "🏆", label: "Classement",    desc: "Top 544 joueurs · filtres poste, équipe, tier" },
  { href: "/compare",       icon: "⚡", label: "Comparateur",   desc: "Radar superposé · tableau métrique · verdict recrutement" },
  { href: "/composition",   icon: "📋", label: "Compo XV",      desc: "Construis ton XV · score collectif · radar d'équipe" },
  { href: "/team",          icon: "🛡️", label: "Équipes",       desc: "Force par club · distribution des tiers · historique" },
  { href: "/international", icon: "🌍", label: "International", desc: "Joueurs capped · dual ranking T14 vs sélection nationale" },
  { href: "/predict",       icon: "🎯", label: "Prédicteur",    desc: "Probabilité de victoire basée sur les notes des effectifs" },
  { href: "/methodologie",  icon: "📐", label: "Méthodologie",  desc: "Comprendre le système de notation FIFA-style Rugby" },
]

export default async function HomePage() {
  const [meta, top5] = await Promise.all([getMeta(), getTop5()])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">

      {/* Hero */}
      <section className="text-center space-y-5">
        <div
          className="inline-block px-3 py-1 rounded-full border text-xs font-semibold text-orange-400 mb-2 tracking-wider uppercase"
          style={{ background: "rgba(249,115,22,0.08)", borderColor: "rgba(249,115,22,0.25)" }}
        >
          Saison 2025-2026 · Top 14
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
          Rugby<span className="text-gradient"> Analytics</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Notation FIFA-style pour les 544 joueurs du Top 14 · 6 saisons d&apos;historique · Données LNR
        </p>
        {meta && (
          <div className="flex flex-wrap justify-center gap-10 mt-8 pt-6 border-t" style={{ borderColor: "#1E3050" }}>
            {[
              { label: "Joueurs scorés", value: meta.n_players },
              { label: "Clubs",          value: meta.n_teams },
              { label: "Note moyenne",   value: meta.avg_rating },
              { label: "Saisons",        value: 6 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-gradient tabular-nums">{value}</div>
                <div className="text-xs text-slate-500 mt-1.5 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top 5 */}
      {top5.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Top 5 joueurs</h2>
          <div className="grid gap-2">
            {top5.map((p, i) => (
              <Link
                key={p.lnr_slug}
                href={`/player/${p.lnr_slug}`}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-orange-500/30 group"
                style={{
                  background: i === 0 ? "rgba(255,215,0,0.04)" : "#0F1A2E",
                  borderColor: i === 0 ? "rgba(255,215,0,0.2)" : i === 1 ? "rgba(192,192,192,0.12)" : i === 2 ? "rgba(205,127,50,0.15)" : "#1E3050",
                }}
              >
                <span className="text-xl font-black w-8 text-center shrink-0" style={{
                  color: i === 0 ? "#FFD700" : i === 1 ? "#A0A0A0" : i === 2 ? "#CD7F32" : "#2A4270",
                }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${p.rank}`}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white group-hover:text-orange-400 transition-colors">{p.name}</span>
                    <TierBadge tier={p.tier} size="xs" />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{p.team} · {p.position_group}</div>
                  <div className="mt-2 max-w-xs">
                    <RatingBar rating={p.rating} tier={p.tier} size="sm" />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-orange-400 tabular-nums">{p.rating}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{p.form_trend}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Modules */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Explorer</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map(({ href, icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="p-5 rounded-xl border flex flex-col gap-3 transition-all hover:border-orange-500/30 hover:bg-orange-500/5 group"
              style={{ background: "#0F1A2E", borderColor: "#1E3050" }}
            >
              <span className="text-3xl">{icon}</span>
              <div>
                <div className="font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">{label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
