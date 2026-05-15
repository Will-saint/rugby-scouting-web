import Link from "next/link"
import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { RatingBar } from "@/components/RatingBar"

export const revalidate = 300

export default async function TeamsPage() {
  const teams = await api.teams()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">Équipes Top 14</h1>
      <div className="grid gap-3">
        {teams.map((t) => (
          <Link
            key={t.team}
            href={`/team/${encodeURIComponent(t.team)}`}
            className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-orange-500/40 hover:bg-orange-500/5"
            style={{ background: "#111827", borderColor: "#1e2d42" }}
          >
            <span className="text-xl font-bold text-slate-600 w-6 text-center">{t.rank}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">{t.team}</span>
                <TierBadge tier={t.tier} size="xs" />
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{t.n_players} joueurs · Meilleur : {t.top_player}</div>
              <div className="mt-2">
                <RatingBar rating={t.avg_rating} tier={t.tier} size="sm" />
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold text-orange-400">{t.avg_rating}</div>
              <div className="text-xs text-slate-500">force moy.</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
