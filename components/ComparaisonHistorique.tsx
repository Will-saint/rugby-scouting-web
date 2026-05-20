"use client"
import { useState } from "react"
import { api } from "@/lib/api"
import type { SeasonRating, PlayerDetail } from "@/lib/types"
import { PlayerRadar } from "@/components/PlayerRadar"

interface Props {
  slug: string
  currentSeason: string
  currentAxes: Record<string, number | null>
  playerName: string
  history: SeasonRating[]
}

const STAT_ROWS = [
  { key: "rating",              label: "Note globale",        fmt: (v: number) => v.toFixed(1) },
  { key: "tackles_per80",       label: "Plaquages / 80 min",  fmt: (v: number) => v.toFixed(2) },
  { key: "offloads_per80",      label: "Offloads / 80 min",   fmt: (v: number) => v.toFixed(2) },
  { key: "line_breaks_per80",   label: "Franchissements / 80",fmt: (v: number) => v.toFixed(2) },
  { key: "turnovers_won_per80", label: "Turnovers / 80 min",  fmt: (v: number) => v.toFixed(2) },
  { key: "tries_per80",         label: "Essais / 80 min",     fmt: (v: number) => v.toFixed(2) },
  { key: "minutes_played",      label: "Minutes jouées",      fmt: (v: number) => `${Math.round(v)} min` },
]

export function ComparaisonHistorique({ slug, currentSeason, currentAxes, history }: Props) {
  const pastSeasons = history.filter(h => h.season !== currentSeason && h.rating != null)
  const [selected, setSelected] = useState(pastSeasons[0]?.season ?? "")
  const [pastDetail, setPastDetail] = useState<PlayerDetail | null>(null)
  const [loading, setLoading] = useState(false)

  if (pastSeasons.length === 0) return null

  const loadSeason = async (s: string) => {
    if (!s) return
    setSelected(s)
    setLoading(true)
    try {
      const d = await api.player(slug, s)
      setPastDetail(d)
    } catch {
      setPastDetail(null)
    } finally {
      setLoading(false)
    }
  }

  const compareAxes = pastDetail ? {
    axis_att: pastDetail.axis_att,
    axis_def: pastDetail.axis_def,
    axis_ctrl: pastDetail.axis_ctrl,
    axis_kick: pastDetail.axis_kick,
    axis_pow: pastDetail.axis_pow,
    axis_gabarit: pastDetail.axis_gabarit,
    axis_disc: pastDetail.axis_disc,
  } : null

  const currentAge = history.find(h => h.season === currentSeason)?.age
  const pastAge = history.find(h => h.season === selected)?.age

  return (
    <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Évolution du profil
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {currentSeason} (orange) vs saison passée (gris)
          </p>
        </div>
        <select
          value={selected}
          onChange={e => loadSeason(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border outline-none"
          style={{ background: "#1e2d42", borderColor: "#334155", color: "#94a3b8" }}
        >
          {pastSeasons.map(h => (
            <option key={h.season} value={h.season}>
              {h.season}{h.age ? ` · ${h.age} ans` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Radar */}
      <div className="mb-6">
        {loading ? (
          <div className="h-64 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
        ) : (
          <PlayerRadar
            data={currentAxes}
            compareData={compareAxes ?? undefined}
            compareLabel={`${selected}${pastAge ? ` (${pastAge} ans)` : ""}`}
            playerName={`${currentSeason}${currentAge ? ` (${currentAge} ans)` : ""}`}
            height={260}
          />
        )}
      </div>

      {/* Stat diff table */}
      {pastDetail && !loading && (
        <div className="space-y-1">
          <div className="grid grid-cols-4 text-xs font-mono uppercase tracking-wider py-1.5 border-b" style={{ color: "#475569", borderColor: "#1e2d42", letterSpacing: "0.08em" }}>
            <span>Stat</span>
            <span className="text-center">{selected.slice(0, 7)}</span>
            <span className="text-center">{currentSeason.slice(0, 7)}</span>
            <span className="text-center">Δ</span>
          </div>
          {STAT_ROWS.map(({ key, label, fmt }) => {
            const pastVal = (pastDetail as unknown as Record<string, number | null>)[key]
            const currVal = currentAxes[key] !== undefined
              ? (currentAxes as Record<string, number | null>)[key]
              : null
            if (pastVal == null && currVal == null) return null
            const diff = pastVal != null && currVal != null ? currVal - pastVal : null
            const diffColor = diff == null ? "#64748b" : diff > 0 ? "#4ade80" : diff < 0 ? "#f87171" : "#94a3b8"
            return (
              <div key={key} className="grid grid-cols-4 text-xs py-1.5 border-b" style={{ borderColor: "#0f172a" }}>
                <span className="text-slate-400">{label}</span>
                <span className="text-center text-slate-500">{pastVal != null ? fmt(pastVal) : "—"}</span>
                <span className="text-center text-white font-medium">{currVal != null ? fmt(currVal) : "—"}</span>
                <span className="text-center font-mono font-semibold" style={{ color: diffColor }}>
                  {diff != null ? `${diff > 0 ? "+" : ""}${fmt(diff)}` : "—"}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
