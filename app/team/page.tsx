import Link from "next/link"
import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { SeasonSelector } from "@/components/SeasonSelector"

export const revalidate = 300

interface Props { searchParams: { season?: string } }

function StandingsBadge({ rank }: { rank: number | null }) {
  if (!rank) return null
  if (rank <= 2) return <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "#d4af3720", color: "#d4af37", border: "1px solid #d4af3740" }}>Demi-finale</span>
  if (rank <= 6) return <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "#1a3a2e20", color: "#4ade80", border: "1px solid #1a3a2e60" }}>Barrage</span>
  if (rank >= 13) return <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "#b94f3a20", color: "#b94f3a", border: "1px solid #b94f3a40" }}>Relégation</span>
  return null
}

export default async function TeamsPage({ searchParams }: Props) {
  const seasons = await api.seasons().catch(() => ["2025-2026"])
  const season = seasons.includes(searchParams.season ?? "") ? searchParams.season! : seasons[seasons.length - 1] ?? "2025-2026"
  const teams = await api.teams(season)

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0" }}>
      {/* Header */}
      <div className="px-6 sm:px-12 pt-12 pb-6 border-b flex items-baseline justify-between" style={{ borderColor: "var(--color-line)" }}>
        <div>
          <h1 className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 52, fontWeight: 400, lineHeight: 1 }}>
            Équipes <em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>Top 14</em>
          </h1>
          <p className="font-mono text-xs mt-2" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
            CLASSEMENT LNR · {season}
          </p>
        </div>
        <SeasonSelector seasons={seasons} current={season} />
      </div>

      {/* Table header */}
      <div className="px-6 sm:px-12 py-3 grid items-center font-mono text-xs uppercase tracking-wider border-b"
        style={{ borderColor: "var(--color-line)", color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace",
          gridTemplateColumns: "48px 1fr 32px 32px 32px 60px 80px" }}>
        <span>#</span>
        <span>Club</span>
        <span className="text-center">V</span>
        <span className="text-center">D</span>
        <span className="text-center">J</span>
        <span className="text-center">Pts</span>
        <span className="text-right">Force</span>
      </div>

      {/* Rows */}
      <div className="px-6 sm:px-12">
        {teams.map((t, i) => {
          const isLast2 = (t.lnr_rank ?? 99) >= 13
          const isTop6 = (t.lnr_rank ?? 99) <= 6
          return (
            <Link
              key={t.team}
              href={`/team/${encodeURIComponent(t.team)}?season=${season}`}
              className="grid items-center py-4 border-b transition-colors hover:bg-stone-50/60 group"
              style={{
                borderColor: "var(--color-line)",
                gridTemplateColumns: "48px 1fr 32px 32px 32px 60px 80px",
                background: isLast2 ? "rgba(185,79,58,0.03)" : "transparent",
              }}
            >
              {/* Rank */}
              <span className="font-serif italic"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: i < 3 ? 28 : 18, fontStyle: "italic",
                  color: i === 0 ? "var(--color-ochre)" : "var(--color-muted)" }}>
                {t.lnr_rank ?? t.rank}
              </span>

              {/* Team name + badges */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold group-hover:underline text-sm sm:text-base"
                    style={{ color: "var(--color-ink)", textDecorationColor: "var(--color-terra)" }}>
                    {t.team}
                  </span>
                  <StandingsBadge rank={t.lnr_rank} />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <TierBadge tier={t.tier} size="xs" />
                  <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {t.n_players} joueurs
                    {t.top_player ? ` · ${t.top_player}` : ""}
                  </span>
                </div>
              </div>

              {/* V */}
              <span className="text-center text-sm font-semibold" style={{ color: t.won ? "var(--color-forest)" : "var(--color-muted)" }}>
                {t.won ?? "—"}
              </span>
              {/* D */}
              <span className="text-center text-sm" style={{ color: "var(--color-muted)" }}>
                {t.lost ?? "—"}
              </span>
              {/* J */}
              <span className="text-center text-sm" style={{ color: "var(--color-muted)" }}>
                {t.played ?? "—"}
              </span>
              {/* Points LNR */}
              <span className="text-center font-semibold font-mono"
                style={{ color: isTop6 ? "var(--color-forest)" : isLast2 ? "var(--color-terra)" : "var(--color-ink)", fontFamily: "'JetBrains Mono', monospace" }}>
                {t.points ?? "—"}
              </span>
              {/* Force moyenne */}
              <span className="text-right font-serif italic text-lg"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--color-terra)" }}>
                {t.avg_rating}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Legend */}
      <div className="px-6 sm:px-12 py-5 flex flex-wrap gap-4 text-xs" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
        <span><span style={{ color: "#d4af37" }}>■</span> Demi-finale directe (1-2)</span>
        <span><span style={{ color: "#4ade80" }}>■</span> Barrage (3-6)</span>
        <span><span style={{ color: "#b94f3a" }}>■</span> Zone relégation (13-14)</span>
        <span style={{ marginLeft: "auto" }}>V = victoires · D = défaites · J = matchs joués · Pts = points LNR</span>
      </div>
    </div>
  )
}
