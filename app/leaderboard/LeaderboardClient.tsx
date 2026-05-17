"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import type { PlayerRank, TeamSummary } from "@/lib/types"
import { TierBadge } from "@/components/TierBadge"
import { RatingBar } from "@/components/RatingBar"
import { POSITIONS, POSITION_LABELS } from "@/lib/constants"

interface Props { players: PlayerRank[]; teams: TeamSummary[] }

const TIERS = ["ALL", "LEGENDAIRE", "OR", "ARGENT", "BRONZE", "STANDARD"]
const RANK_STYLE: Record<number, { color: string; bg: string }> = {
  1: { color: "#FFD700", bg: "rgba(255,215,0,0.04)" },
  2: { color: "#C0C0C0", bg: "rgba(192,192,192,0.03)" },
  3: { color: "#CD7F32", bg: "rgba(205,127,50,0.04)" },
}

export function LeaderboardClient({ players, teams }: Props) {
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

  const sel = "px-3 py-1.5 rounded-lg border text-sm text-white outline-none focus:border-orange-500/50 transition-colors"
  const selStyle = { background: "#0F1A2E", borderColor: "#1E3050" }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Classement général</h1>
        <p className="text-slate-500 text-sm mt-1">{filtered.length} joueurs · Top 14 2025-2026</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un joueur…"
          className={sel}
          style={selStyle}
        />
        <select value={position} onChange={(e) => setPosition(e.target.value)} className={sel} style={selStyle}>
          {POSITIONS.map((p) => <option key={p} value={p}>{p === "ALL" ? "Tous les postes" : POSITION_LABELS[p] || p}</option>)}
        </select>
        <select value={team} onChange={(e) => setTeam(e.target.value)} className={sel} style={selStyle}>
          {teamNames.map((t) => <option key={t} value={t}>{t === "ALL" ? "Toutes les équipes" : t}</option>)}
        </select>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className={sel} style={selStyle}>
          {TIERS.map((t) => <option key={t} value={t}>{t === "ALL" ? "Tous les tiers" : t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#1E3050" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "#08111F" }}>
            <tr className="text-left text-slate-600 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 w-10">#</th>
              <th className="px-4 py-3">Joueur</th>
              <th className="px-4 py-3 hidden sm:table-cell">Poste</th>
              <th className="px-4 py-3 hidden md:table-cell">Club</th>
              <th className="px-4 py-3 hidden lg:table-cell">Âge</th>
              <th className="px-4 py-3 hidden lg:table-cell">Nat.</th>
              <th className="px-4 py-3 w-36">Note</th>
              <th className="px-4 py-3 w-8 text-center">↗</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const rs = RANK_STYLE[p.rank]
              return (
                <tr
                  key={p.lnr_slug}
                  className="border-t transition-colors hover:bg-white/[0.02]"
                  style={{ borderColor: "#162236", background: rs?.bg }}
                >
                  <td className="px-4 py-3 font-mono text-xs font-bold" style={{ color: rs?.color || "#2A4270" }}>
                    {p.rank <= 3 ? ["🥇","🥈","🥉"][p.rank - 1] : p.rank}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/player/${p.lnr_slug}`} className="hover:text-orange-400 transition-colors font-medium">
                      {p.name}
                    </Link>
                    <div className="mt-0.5">
                      <TierBadge tier={p.tier} size="xs" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell text-xs">
                    {POSITION_LABELS[p.position_group] || p.position_group}
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell text-xs">{p.team}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell text-xs">{p.age ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell text-xs">{p.nationality ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-orange-400 w-10 text-right tabular-nums">{p.rating}</span>
                      <div className="flex-1 hidden sm:block">
                        <RatingBar rating={p.rating} tier={p.tier} size="sm" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500">{p.form_trend}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-600">Aucun joueur trouvé</div>
        )}
      </div>
    </div>
  )
}
