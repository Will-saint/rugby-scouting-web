"use client"
import { useState, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts"
import type { PlayerSummary } from "@/lib/types"
import { TierBadge } from "@/components/TierBadge"
import { TIER_COLORS } from "@/lib/constants"

// ── Slot definitions ──────────────────────────────────────────────────────────
const XV_SLOTS = [
  { num: 1,  label: "Pilier G",  abbr: "1",  pg: "FRONT_ROW" },
  { num: 2,  label: "Talonneur", abbr: "2",  pg: "FRONT_ROW" },
  { num: 3,  label: "Pilier D",  abbr: "3",  pg: "FRONT_ROW" },
  { num: 4,  label: "2e Ligne",  abbr: "4",  pg: "LOCK" },
  { num: 5,  label: "2e Ligne",  abbr: "5",  pg: "LOCK" },
  { num: 6,  label: "Flanker G", abbr: "6",  pg: "BACK_ROW" },
  { num: 7,  label: "Flanker D", abbr: "7",  pg: "BACK_ROW" },
  { num: 8,  label: "N°8",       abbr: "8",  pg: "BACK_ROW" },
  { num: 9,  label: "Demi",      abbr: "9",  pg: "SCRUM_HALF" },
  { num: 10, label: "Ouvreur",   abbr: "10", pg: "FLY_HALF" },
  { num: 11, label: "Ailier G",  abbr: "11", pg: "WINGER" },
  { num: 12, label: "Centre G",  abbr: "12", pg: "CENTRE" },
  { num: 13, label: "Centre D",  abbr: "13", pg: "CENTRE" },
  { num: 14, label: "Ailier D",  abbr: "14", pg: "WINGER" },
  { num: 15, label: "Arrière",   abbr: "15", pg: "FULLBACK" },
]

const POS_WEIGHT: Record<string, number> = {
  FRONT_ROW: 1.0, LOCK: 1.0, BACK_ROW: 1.1,
  SCRUM_HALF: 1.2, FLY_HALF: 1.3,
  WINGER: 1.0, CENTRE: 1.1, FULLBACK: 1.2,
}

const POS_COLOR: Record<string, string> = {
  FRONT_ROW: "#92400E", LOCK: "#1E3A5F", BACK_ROW: "#064E3B",
  SCRUM_HALF: "#4C1D95", FLY_HALF: "#7C2D12",
  WINGER: "#1E40AF", CENTRE: "#065F46", FULLBACK: "#1D4ED8",
}

const RADAR_AXES = [
  { key: "axis_att", label: "ATT" },
  { key: "axis_def", label: "DEF" },
  { key: "axis_ctrl", label: "CTRL" },
  { key: "axis_kick", label: "KICK" },
  { key: "axis_pow", label: "POW" },
  { key: "axis_gabarit", label: "PHYS" },
  { key: "axis_disc", label: "DISC" },
]

// ── Types ─────────────────────────────────────────────────────────────────────
interface CompositionResult {
  collective_score: number
  tier: string
  n_players: number
  axes: Record<string, number>
  players: PlayerSummary[]
}

interface Props {
  allPlayers: PlayerSummary[]
  teams: string[]
  apiBase: string
}

// ── Player selector ───────────────────────────────────────────────────────────
function PlayerSelector({
  slot, allPlayers, selected, usedSlugs, onChange,
}: {
  slot: typeof XV_SLOTS[0]
  allPlayers: PlayerSummary[]
  selected: PlayerSummary | null
  usedSlugs: Set<string>
  onChange: (p: PlayerSummary | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const candidates = useMemo(() =>
    allPlayers
      .filter(p => p.position_group === slot.pg)
      .filter(p => !usedSlugs.has(p.lnr_slug!) || p.lnr_slug === selected?.lnr_slug)
      .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 30)
  , [allPlayers, slot.pg, usedSlugs, selected, search])

  const color = POS_COLOR[slot.pg] || "#374151"

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left rounded-lg border p-2 transition-all hover:border-opacity-70 text-xs"
        style={{ background: selected ? `${color}18` : "#0d1626", borderColor: selected ? color : "#1e2d42" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-slate-500 w-4 shrink-0">#{slot.num}</span>
          {selected ? (
            <>
              {selected.photo_url && (
                <div className="w-6 h-6 rounded-full overflow-hidden relative shrink-0">
                  <Image src={selected.photo_url} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <div className="font-semibold text-white truncate leading-tight">{selected.name.split(" ").pop()}</div>
                <div className="text-slate-500 text-[10px] truncate">{selected.team}</div>
              </div>
              <span className="ml-auto font-bold shrink-0" style={{ color: TIER_COLORS[selected.tier] }}>
                {selected.rating}
              </span>
            </>
          ) : (
            <span className="text-slate-500">{slot.label}</span>
          )}
        </div>
      </button>

      {open && (
        <div
          className="absolute z-50 left-0 top-full mt-1 w-64 rounded-xl border shadow-2xl overflow-hidden"
          style={{ background: "#0d1626", borderColor: "#1e2d42" }}
        >
          <div className="p-2 border-b" style={{ borderColor: "#1e2d42" }}>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Chercher ${slot.label}…`}
              className="w-full px-2 py-1 rounded text-xs text-white bg-slate-800 border border-slate-700 outline-none"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {selected && (
              <button
                onClick={() => { onChange(null); setOpen(false); setSearch("") }}
                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Retirer du XV
              </button>
            )}
            {candidates.map(p => (
              <button
                key={p.lnr_slug}
                onClick={() => { onChange(p); setOpen(false); setSearch("") }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-xs w-8 shrink-0" style={{ color: TIER_COLORS[p.tier] }}>{p.rating}</span>
                <div className="min-w-0">
                  <div className="text-white text-xs font-medium truncate">{p.name}</div>
                  <div className="text-slate-500 text-[10px] truncate">{p.team}</div>
                </div>
              </button>
            ))}
            {candidates.length === 0 && (
              <div className="px-3 py-4 text-xs text-slate-500 text-center">Aucun joueur disponible</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function CompositionClient({ allPlayers, apiBase }: Props) {
  const [xv, setXv] = useState<Record<number, PlayerSummary | null>>(
    () => Object.fromEntries(XV_SLOTS.map(s => [s.num, null]))
  )
  const [result, setResult] = useState<CompositionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const usedSlugs = useMemo(() => {
    const s = new Set<string>()
    Object.values(xv).forEach(p => { if (p?.lnr_slug) s.add(p.lnr_slug) })
    return s
  }, [xv])

  const filledPlayers = useMemo(() =>
    XV_SLOTS.map(s => xv[s.num]).filter(Boolean) as PlayerSummary[]
  , [xv])

  const autoFill = useCallback(() => {
    const used = new Set<string>()
    const next: Record<number, PlayerSummary | null> = {}
    for (const slot of XV_SLOTS) {
      const cands = allPlayers
        .filter(p => p.position_group === slot.pg && !used.has(p.lnr_slug!))
        .sort((a, b) => b.rating - a.rating)
      if (cands[0]) {
        next[slot.num] = cands[0]
        used.add(cands[0].lnr_slug!)
      } else {
        next[slot.num] = null
      }
    }
    setXv(next)
    setResult(null)
  }, [allPlayers])

  const compute = useCallback(async () => {
    const slugs = filledPlayers.map(p => p.lnr_slug!).filter(Boolean)
    if (slugs.length === 0) return
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/composition/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs }),
      })
      const data = await res.json()
      setResult(data)
    } finally {
      setLoading(false)
    }
  }, [filledPlayers, apiBase])

  // Collective score computed locally (without API call) for live preview
  const localScore = useMemo(() => {
    if (filledPlayers.length === 0) return null
    let tw = 0, twr = 0
    for (const slot of XV_SLOTS) {
      const p = xv[slot.num]
      if (!p) continue
      const w = POS_WEIGHT[slot.pg] || 1
      tw += w; twr += w * p.rating
    }
    return tw > 0 ? Math.round(twr / tw * 10) / 10 : null
  }, [xv, filledPlayers])

  const radarData = result ? RADAR_AXES.map(({ key, label }) => ({
    axis: label,
    value: result.axes[key] ?? 0,
  })) : null

  const accentColor = result ? (TIER_COLORS[result.tier] || "#F97316") : "#F97316"

  // Sectors
  const SECTORS = [
    { label: "Mêlée", nums: [1, 2, 3] },
    { label: "Touche", nums: [4, 5] },
    { label: "3e Ligne", nums: [6, 7, 8] },
    { label: "Charnières", nums: [9, 10] },
    { label: "Centres", nums: [12, 13] },
    { label: "Ailes/Arr.", nums: [11, 14, 15] },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Composition XV</h1>
          <p className="text-slate-400 text-sm mt-1">Construis ton XV idéal — score collectif en temps réel</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={autoFill}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            ⚡ Auto-fill meilleur XV
          </button>
          <button
            onClick={() => { setXv(Object.fromEntries(XV_SLOTS.map(s => [s.num, null]))); setResult(null) }}
            className="px-4 py-2 rounded-lg text-sm border border-slate-700 text-slate-400 hover:bg-white/5 transition-colors"
          >
            Vider
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_320px] gap-6">
        {/* Formation */}
        <div className="space-y-3">
          {/* Live score badge */}
          {localScore !== null && (
            <div
              className="rounded-xl border px-5 py-3 flex items-center gap-4"
              style={{ background: "#0d1626", borderColor: "#1e2d42" }}
            >
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Score collectif</div>
                <div className="text-3xl font-bold text-orange-400">{localScore}</div>
              </div>
              <div className="text-sm text-slate-400">{filledPlayers.length}/15 joueurs</div>
              <button
                onClick={compute}
                disabled={loading || filledPlayers.length === 0}
                className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
              >
                {loading ? "Calcul…" : "Analyser →"}
              </button>
            </div>
          )}

          {/* Arrières */}
          <div className="text-xs text-slate-600 uppercase tracking-widest text-center">▲ Arrières</div>
          <div className="grid grid-cols-1 max-w-xs mx-auto">
            <PlayerSelector slot={XV_SLOTS[14]} allPlayers={allPlayers} selected={xv[15]} usedSlugs={usedSlugs} onChange={p => setXv(x => ({ ...x, 15: p }))} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[11,12,13,14].map(n => {
              const slot = XV_SLOTS[n - 1]
              return <PlayerSelector key={n} slot={slot} allPlayers={allPlayers} selected={xv[n]} usedSlugs={usedSlugs} onChange={p => setXv(x => ({ ...x, [n]: p }))} />
            })}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[9,10].map(n => {
              const slot = XV_SLOTS[n - 1]
              return <PlayerSelector key={n} slot={slot} allPlayers={allPlayers} selected={xv[n]} usedSlugs={usedSlugs} onChange={p => setXv(x => ({ ...x, [n]: p }))} />
            })}
            <div /><div />
          </div>

          {/* Avants */}
          <div className="text-xs text-slate-600 uppercase tracking-widest text-center">▼ Avants</div>
          <div className="grid grid-cols-3 gap-2">
            {[6,7,8].map(n => {
              const slot = XV_SLOTS[n - 1]
              return <PlayerSelector key={n} slot={slot} allPlayers={allPlayers} selected={xv[n]} usedSlugs={usedSlugs} onChange={p => setXv(x => ({ ...x, [n]: p }))} />
            })}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div />
            {[4,5].map(n => {
              const slot = XV_SLOTS[n - 1]
              return <PlayerSelector key={n} slot={slot} allPlayers={allPlayers} selected={xv[n]} usedSlugs={usedSlugs} onChange={p => setXv(x => ({ ...x, [n]: p }))} />
            })}
            <div />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3].map(n => {
              const slot = XV_SLOTS[n - 1]
              return <PlayerSelector key={n} slot={slot} allPlayers={allPlayers} selected={xv[n]} usedSlugs={usedSlugs} onChange={p => setXv(x => ({ ...x, [n]: p }))} />
            })}
          </div>

          {/* Secteurs */}
          {filledPlayers.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
              {SECTORS.map(({ label, nums }) => {
                const sPlayers = nums.map(n => xv[n]).filter(Boolean) as PlayerSummary[]
                if (sPlayers.length === 0) return null
                const avg = sPlayers.reduce((s, p) => s + p.rating, 0) / sPlayers.length
                const tier = avg >= 84 ? "OR" : avg >= 77 ? "ARGENT" : avg >= 70 ? "BRONZE" : "STANDARD"
                const color = TIER_COLORS[tier]
                return (
                  <div key={label} className="rounded-lg border p-2 text-center" style={{ background: `${color}0A`, borderColor: `${color}33` }}>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</div>
                    <div className="text-lg font-bold mt-0.5" style={{ color }}>{avg.toFixed(1)}</div>
                    <div className="text-[10px] text-slate-600">{sPlayers.map(p => p.name.split(" ").pop()).join(" · ")}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar : résultat analyse */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Score */}
              <div
                className="rounded-xl border p-5"
                style={{ background: "#0d1626", borderColor: accentColor + "44", borderLeftWidth: 4, borderLeftColor: accentColor }}
              >
                <div className="text-xs text-slate-500 uppercase tracking-wider">Score collectif</div>
                <div className="text-4xl font-bold mt-1" style={{ color: accentColor }}>{result.collective_score}</div>
                <div className="mt-2">
                  <TierBadge tier={result.tier} size="lg" />
                </div>
                <div className="text-xs text-slate-500 mt-2">{result.n_players} joueurs · pondéré par poste</div>
              </div>

              {/* Radar */}
              {radarData && (
                <div className="rounded-xl border p-4" style={{ background: "#0d1626", borderColor: "#1e2d42" }}>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">Profil collectif</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData} margin={{ top: 5, right: 15, bottom: 5, left: 15 }}>
                      <PolarGrid stroke="#1e2d42" />
                      <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <Radar
                        dataKey="value" name="XV"
                        stroke={accentColor} fill={accentColor} fillOpacity={0.2} strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    {RADAR_AXES.map(({ key, label }) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-slate-500">{label}</span>
                        <span className="text-white font-medium">{result.axes[key]?.toFixed(1) ?? "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* XV liste */}
          {filledPlayers.length > 0 && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#1e2d42" }}>
              <div className="px-3 py-2 text-xs text-slate-500 uppercase tracking-wider" style={{ background: "#0d1626" }}>
                XV sélectionné
              </div>
              {XV_SLOTS.filter(s => xv[s.num]).map(slot => {
                const p = xv[slot.num]!
                const color = TIER_COLORS[p.tier]
                return (
                  <div
                    key={slot.num}
                    className="flex items-center gap-2 px-3 py-1.5 border-t text-xs"
                    style={{ borderColor: "#1a2233" }}
                  >
                    <span className="text-slate-600 w-4 font-mono shrink-0">#{slot.num}</span>
                    <span className="text-slate-500 w-14 shrink-0 truncate">{slot.label}</span>
                    <Link href={`/player/${p.lnr_slug}`} className="flex-1 min-w-0 font-medium text-white hover:text-orange-400 truncate">
                      {p.name}
                    </Link>
                    <span className="font-bold shrink-0" style={{ color }}>{p.rating}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
