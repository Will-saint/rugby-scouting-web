"use client"
import { useState, useMemo } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import type { PlayerRank, TeamSummary } from "@/lib/types"
import { TierBadge } from "@/components/TierBadge"
import { RatingBar } from "@/components/RatingBar"
import { POSITIONS, POSITION_LABELS } from "@/lib/constants"
import { SeasonSelector } from "@/components/SeasonSelector"

interface Props { players: PlayerRank[]; teams: TeamSummary[]; seasons: string[]; currentSeason: string }

const TIERS = ["ALL", "LEGENDAIRE", "OR", "ARGENT", "BRONZE", "STANDARD"]

export function LeaderboardClient({ players, teams, seasons, currentSeason }: Props) {
  const [position, setPosition] = useState("ALL")
  const [team, setTeam]         = useState("ALL")
  const [tier, setTier]         = useState("ALL")
  const [search, setSearch]     = useState("")

  const filtered = useMemo(() => players.filter((p) => {
    if (position !== "ALL" && p.position_group !== position) return false
    if (team     !== "ALL" && p.team           !== team)     return false
    if (tier     !== "ALL" && p.tier           !== tier)     return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [players, position, team, tier, search])

  const teamNames = ["ALL", ...teams.map((t) => t.team)]

  const selStyle: CSSProperties = {
    background: "var(--color-paper)",
    borderColor: "var(--color-line-2)",
    color: "var(--color-ink)",
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0" }}>
      {/* Header */}
      <div className="px-6 sm:px-12 pt-12 pb-5 flex items-baseline justify-between border-b" style={{ borderColor: "var(--color-line)" }}>
        <div>
          <h1 className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 56, fontWeight: 400, lineHeight: 1 }}>
            Classement <em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>général</em>
          </h1>
          <p className="font-mono text-xs mt-2 tracking-wider" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
            {filtered.length} JOUEURS · TOP 14 · {currentSeason}
          </p>
        </div>
        <SeasonSelector seasons={seasons} current={currentSeason} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 px-6 sm:px-12 py-5 border-b" style={{ borderColor: "var(--color-line)" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un joueur…"
          className="px-4 py-2 rounded-full border text-sm outline-none"
          style={{ ...selStyle, border: "1px solid var(--color-line-2)" }}
        />
        <select value={position} onChange={(e) => setPosition(e.target.value)}
          className="px-4 py-2 rounded-full border text-sm outline-none"
          style={{ ...selStyle, border: "1px solid var(--color-line-2)" }}>
          {POSITIONS.map((p) => <option key={p} value={p}>{p === "ALL" ? "Tous les postes" : POSITION_LABELS[p] || p}</option>)}
        </select>
        <select value={team} onChange={(e) => setTeam(e.target.value)}
          className="px-4 py-2 rounded-full border text-sm outline-none"
          style={{ ...selStyle, border: "1px solid var(--color-line-2)" }}>
          {teamNames.map((t) => <option key={t} value={t}>{t === "ALL" ? "Toutes les équipes" : t}</option>)}
        </select>
        <select value={tier} onChange={(e) => setTier(e.target.value)}
          className="px-4 py-2 rounded-full border text-sm outline-none"
          style={{ ...selStyle, border: "1px solid var(--color-line-2)" }}>
          {TIERS.map((t) => <option key={t} value={t}>{t === "ALL" ? "Tous les tiers" : t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="border-b" style={{ borderColor: "var(--color-line)" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "var(--color-paper-2)" }}>
            <tr className="border-b font-mono text-left text-xs tracking-wider uppercase"
              style={{ borderColor: "var(--color-line)", color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
              <th className="px-6 sm:px-12 py-3 w-12">#</th>
              <th className="px-4 py-3">Joueur</th>
              <th className="px-4 py-3 hidden sm:table-cell">Poste</th>
              <th className="px-4 py-3 hidden md:table-cell">Club</th>
              <th className="px-4 py-3 hidden lg:table-cell">Âge</th>
              <th className="px-4 py-3 hidden lg:table-cell">Nat.</th>
              <th className="px-4 py-3 w-40">Note</th>
              <th className="px-4 pr-6 sm:pr-12 py-3 w-8 text-center">↗</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.lnr_slug} className="border-b transition-colors hover:bg-stone-100/40 group"
                style={{ borderColor: "var(--color-line)" }}>
                <td className="px-6 sm:px-12 py-4 font-serif italic" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", color: "var(--color-muted)", fontSize: p.rank <= 3 ? 24 : 16 }}>
                  {p.rank <= 3 ? ["1", "2", "3"][p.rank - 1] : p.rank}
                </td>
                <td className="px-4 py-4">
                  <Link href={`/player/${p.lnr_slug}`}
                    className="font-semibold transition-colors group-hover:underline"
                    style={{ color: "var(--color-ink)", textDecorationColor: "var(--color-terra)" }}>
                    {p.name}
                  </Link>
                  <div className="mt-1"><TierBadge tier={p.tier} size="xs" /></div>
                </td>
                <td className="px-4 py-4 text-xs hidden sm:table-cell" style={{ color: "var(--color-muted)" }}>
                  {POSITION_LABELS[p.position_group] || p.position_group}
                </td>
                <td className="px-4 py-4 text-xs hidden md:table-cell" style={{ color: "var(--color-muted)" }}>{p.team}</td>
                <td className="px-4 py-4 text-xs hidden lg:table-cell" style={{ color: "var(--color-muted)" }}>{p.age ?? "—"}</td>
                <td className="px-4 py-4 text-xs hidden lg:table-cell" style={{ color: "var(--color-muted)" }}>{p.nationality ?? "—"}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xl tabular-nums" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--color-ink)" }}>
                      {p.rating}
                    </span>
                    <div className="flex-1 hidden sm:block">
                      <RatingBar rating={p.rating} tier={p.tier} size="sm" />
                    </div>
                  </div>
                </td>
                <td className="px-4 pr-6 sm:pr-12 py-4 text-center font-mono text-xs" style={{ color: "var(--color-muted)" }}>{p.form_trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center font-mono text-sm" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            Aucun joueur trouvé
          </div>
        )}
      </div>
    </div>
  )
}
