import { notFound } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { PlayerRadar } from "@/components/PlayerRadar"
import { RatingHistoryChart } from "@/components/RatingHistoryChart"
import { POSITION_LABELS, TIER_COLORS } from "@/lib/constants"

export const revalidate = 300

interface Props { params: { name: string } }

export default async function TeamPage({ params }: Props) {
  const teamName = decodeURIComponent(params.name)
  let team
  try { team = await api.team(teamName) } catch { notFound() }

  const TIER_ORDER = ["LEGENDAIRE", "OR", "ARGENT", "BRONZE", "STANDARD"]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 flex items-center gap-2">
        <Link href="/team" className="hover:text-orange-400 transition-colors">Équipes</Link>
        <span>/</span>
        <span className="text-slate-300">{team.team}</span>
      </div>

      {/* Header */}
      <div className="rounded-2xl border p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center" style={{ background: "#111827", borderColor: "#1e2d42" }}>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-white">{team.team}</h1>
            <TierBadge tier={team.tier} size="lg" />
          </div>
          <div className="text-slate-400 mt-2 flex gap-4 text-sm flex-wrap">
            <span>Force moyenne : <span className="text-orange-400 font-bold text-lg">{team.avg_rating}</span></span>
            <span>{team.n_players} joueurs</span>
            <span>Saison 2025-2026</span>
          </div>
        </div>
      </div>

      {/* Distribution + Radar */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tier distribution */}
        <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Distribution des tiers</h2>
          <div className="space-y-3">
            {TIER_ORDER.map((tier) => {
              const count = team.tier_distribution[tier] || 0
              const pct = team.n_players > 0 ? (count / team.n_players) * 100 : 0
              return (
                <div key={tier} className="flex items-center gap-3">
                  <span className="text-xs w-24 text-right" style={{ color: TIER_COLORS[tier as keyof typeof TIER_COLORS] }}>{tier}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-1.5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: TIER_COLORS[tier as keyof typeof TIER_COLORS] }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Team radar */}
        <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Profil collectif</h2>
          <PlayerRadar data={team.axes} height={240} playerName={team.team} />
        </div>
      </div>

      {/* Top 5 */}
      <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Top 5 joueurs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {team.top5.map((p, i) => (
            <Link
              key={p.lnr_slug}
              href={`/player/${p.lnr_slug}`}
              className="p-3 rounded-lg border text-center transition-all hover:border-orange-500/40"
              style={{ background: "#0d1626", borderColor: "#1e2d42" }}
            >
              <div className="text-slate-500 text-xs mb-1">#{i + 1}</div>
              <div className="font-semibold text-white text-sm truncate">{p.name}</div>
              <div className="text-xs text-slate-500">{POSITION_LABELS[p.position_group] || p.position_group}</div>
              <div className="text-orange-400 font-bold mt-1">{p.rating}</div>
              <div className="mt-1"><TierBadge tier={p.tier} size="xs" /></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Roster by position */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Effectif par poste</h2>
        {Object.entries(team.roster_by_position).map(([pos, players]) => (
          <details key={pos} className="rounded-xl border overflow-hidden" style={{ borderColor: "#1e2d42" }}>
            <summary
              className="px-5 py-3 cursor-pointer flex justify-between items-center font-medium text-white hover:bg-white/5"
              style={{ background: "#111827" }}
            >
              <span>{POSITION_LABELS[pos] || pos}</span>
              <span className="text-slate-500 text-sm">{players.length} joueurs</span>
            </summary>
            <div style={{ background: "#0d1626" }}>
              {players.map((p) => (
                <Link
                  key={p.lnr_slug}
                  href={`/player/${p.lnr_slug}`}
                  className="flex items-center gap-3 px-5 py-2.5 border-t text-sm hover:bg-white/5 transition-colors"
                  style={{ borderColor: "#1a2233" }}
                >
                  <span className="flex-1 text-white hover:text-orange-400">{p.name}</span>
                  <TierBadge tier={p.tier} size="xs" />
                  <span className="text-orange-400 font-bold tabular-nums w-10 text-right">{p.rating}</span>
                </Link>
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* History */}
      {team.history.length > 1 && (
        <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Évolution de la force</h2>
          <RatingHistoryChart
            history={team.history.map((h) => ({
              season: h.season,
              rating: h.avg_rating,
              age: null,
              minutes_played: null
            }))}
          />
        </div>
      )}
    </div>
  )
}
