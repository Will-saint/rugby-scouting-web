import Link from "next/link"
import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { RatingBar } from "@/components/RatingBar"
import { SeasonSelector } from "@/components/SeasonSelector"

export const revalidate = 300

interface Props { searchParams: { season?: string } }

export default async function TeamsPage({ searchParams }: Props) {
  const seasons = await api.seasons().catch(() => ["2025-2026"])
  const season = seasons.includes(searchParams.season ?? "") ? searchParams.season! : seasons[seasons.length - 1] ?? "2025-2026"
  const teams = await api.teams(season)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 48, fontWeight: 400 }}>
          Équipes <em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>Top 14</em>
        </h1>
        <SeasonSelector seasons={seasons} current={season} />
      </div>
      <div className="grid gap-2">
        {teams.map((t) => (
          <Link
            key={t.team}
            href={`/team/${encodeURIComponent(t.team)}?season=${season}`}
            className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-stone-400"
            style={{ background: "var(--color-paper-2)", borderColor: "var(--color-line)" }}
          >
            <span className="font-serif italic text-2xl w-8 text-center shrink-0"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: "var(--color-muted)" }}>
              {t.rank}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold" style={{ color: "var(--color-ink)" }}>{t.team}</span>
                <TierBadge tier={t.tier} size="xs" />
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                {t.n_players} joueurs · Meilleur : {t.top_player}
              </div>
              <div className="mt-2">
                <RatingBar rating={t.avg_rating} tier={t.tier} size="sm" />
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-serif text-2xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--color-terra)" }}>
                {t.avg_rating}
              </div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>force moy.</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
