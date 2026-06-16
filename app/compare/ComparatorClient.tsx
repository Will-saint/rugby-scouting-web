"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import type { PlayerDetail, PlayerRank } from "@/lib/types"
import { TierBadge } from "@/components/TierBadge"
import { POSITION_LABELS } from "@/lib/constants"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip
} from "recharts"

const RADAR_AXES = [
  { key: "axis_att", label: "Attaque" },
  { key: "axis_def", label: "Défense" },
  { key: "axis_ctrl", label: "Contrôle" },
  { key: "axis_kick", label: "Jeu au pied" },
  { key: "axis_pow", label: "Puissance" },
  { key: "axis_gabarit", label: "Physique" },
  { key: "axis_disc", label: "Discipline" },
]

const COMPARE_ROWS = [
  { label: "Note finale", key: "rating", fmt: (v: number) => v.toFixed(1) },
  { label: "Plaquages/80", key: "tackles_per80", fmt: (v: number) => v?.toFixed(2) ?? "—" },
  { label: "Offloads/80", key: "offloads_per80", fmt: (v: number) => v?.toFixed(2) ?? "—" },
  { label: "Franchissements/80", key: "line_breaks_per80", fmt: (v: number) => v?.toFixed(2) ?? "—" },
  { label: "Essais/80", key: "tries_per80", fmt: (v: number) => v?.toFixed(2) ?? "—" },
  { label: "Pts pied/80", key: "kick_points_per80", fmt: (v: number) => v?.toFixed(2) ?? "—" },
  { label: "Âge", key: "age", fmt: (v: number) => v ? `${v} ans` : "—" },
  { label: "Taille", key: "height_cm", fmt: (v: number) => v ? `${v} cm` : "—" },
  { label: "Poids", key: "weight_kg", fmt: (v: number) => v ? `${v} kg` : "—" },
  { label: "Bonus intl", key: "intl_bonus", fmt: (v: number) => v > 0 ? `+${v.toFixed(2)}` : "—" },
]

function PlayerSelector({
  label, allPlayers, selected, onSelect
}: { label: string; allPlayers: PlayerRank[]; selected: string; onSelect: (s: string) => void }) {
  const [search, setSearch] = useState("")
  const opts = useMemo(() =>
    allPlayers.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 30),
    [allPlayers, search]
  )
  return (
    <div className="space-y-2">
      <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</label>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher…"
        className="w-full px-3 py-2 rounded border text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500/60"
        style={{ background: "#111827", borderColor: "#1e2d42" }}
      />
      <select
        value={selected}
        onChange={(e) => { onSelect(e.target.value); setSearch("") }}
        size={6}
        className="w-full rounded border text-sm text-white outline-none"
        style={{ background: "#111827", borderColor: "#1e2d42" }}
      >
        <option value="">— Sélectionner —</option>
        {opts.map((p) => (
          <option key={p.lnr_slug} value={p.lnr_slug}>
            {p.name} ({p.rating}) · {p.team}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ComparatorClient({ allPlayers }: { allPlayers: PlayerRank[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [slugA, setSlugA] = useState(searchParams.get("a") || "")
  const [slugB, setSlugB] = useState(searchParams.get("b") || "")
  const [playerA, setPlayerA] = useState<PlayerDetail | null>(null)
  const [playerB, setPlayerB] = useState<PlayerDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")

  useEffect(() => {
    if (!slugA && !slugB) return
    setLoading(true)
    setFetchError("")
    Promise.all([
      slugA ? api.player(slugA) : Promise.resolve(null),
      slugB ? api.player(slugB) : Promise.resolve(null),
    ]).then(([a, b]) => {
      setPlayerA(a)
      setPlayerB(b)
      setLoading(false)
      const qs = new URLSearchParams()
      if (slugA) qs.set("a", slugA)
      if (slugB) qs.set("b", slugB)
      router.replace(`/compare?${qs}`, { scroll: false })
    }).catch((err) => {
      setLoading(false)
      setFetchError("Impossible de charger les données joueur. Vérifiez votre connexion ou réessayez.")
      console.error(err)
    })
  }, [slugA, slugB, router])

  const radarData = RADAR_AXES.map(({ key, label }) => ({
    axis: label,
    a: playerA ? (playerA[key as keyof PlayerDetail] as number ?? 0) : 0,
    b: playerB ? (playerB[key as keyof PlayerDetail] as number ?? 0) : 0,
  }))

  function generateVerdict() {
    if (!playerA || !playerB) return null
    const aWins = COMPARE_ROWS.filter(({ key }) => {
      const va = playerA[key as keyof PlayerDetail] as number
      const vb = playerB[key as keyof PlayerDetail] as number
      return va != null && vb != null && va > vb
    }).length
    const bWins = COMPARE_ROWS.filter(({ key }) => {
      const va = playerA[key as keyof PlayerDetail] as number
      const vb = playerB[key as keyof PlayerDetail] as number
      return va != null && vb != null && vb > va
    }).length
    const better = aWins >= bWins ? playerA : playerB
    const worse = aWins >= bWins ? playerB : playerA
    const defDiff = ((playerA.axis_def ?? 0) - (playerB.axis_def ?? 0)).toFixed(0)
    const attDiff = ((playerA.axis_att ?? 0) - (playerB.axis_att ?? 0)).toFixed(0)
    return `${better.name} domine sur ${aWins >= bWins ? aWins : bWins}/${COMPARE_ROWS.length} métriques. ` +
      `Différence défensive : ${Math.abs(+defDiff)} pts · Attaque : ${Math.abs(+attDiff)} pts. ` +
      `${worse.name} compense par son physique (${worse.axis_gabarit ?? "—"}/100).`
  }

  const verdict = generateVerdict()

  const [copied, setCopied] = useState(false)
  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-white">Comparateur</h1>
        {playerA && playerB && (
          <button
            onClick={copyLink}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{ borderColor: "#1e2d42", color: copied ? "#4ade80" : "#94a3b8", background: "#111827" }}
          >
            {copied ? "✓ Lien copié" : "⎘ Partager"}
          </button>
        )}
      </div>

      {/* Player selectors */}
      <div className="grid sm:grid-cols-2 gap-6">
        <PlayerSelector label="Joueur A" allPlayers={allPlayers} selected={slugA} onSelect={setSlugA} />
        <PlayerSelector label="Joueur B" allPlayers={allPlayers} selected={slugB} onSelect={setSlugB} />
      </div>

      {loading && <div className="text-center text-slate-400 py-12">Chargement…</div>}
      {fetchError && <div className="text-center text-red-400 text-sm py-4">{fetchError}</div>}

      {playerA && playerB && !loading && (
        <>
          {/* Mini cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ p: playerA, color: "#F97316", label: "A" }, { p: playerB, color: "#3B82F6", label: "B" }].map(({ p, color, label }) => (
              <div key={p.lnr_slug} className="rounded-xl border p-4 flex gap-4 items-center" style={{ background: "#111827", borderColor: "#1e2d42" }}>
                <span className="text-2xl font-bold w-8 text-center" style={{ color }}>{label}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white flex gap-2 items-center">
                    <Link href={`/player/${p.lnr_slug}`} className="hover:text-orange-400">{p.name}</Link>
                    <TierBadge tier={p.tier} size="xs" />
                  </div>
                  <div className="text-xs text-slate-500">{POSITION_LABELS[p.position_group]} · {p.team}</div>
                </div>
                <span className="text-2xl font-bold" style={{ color }}>{p.rating}</span>
              </div>
            ))}
          </div>

          {/* Radar */}
          <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Radar superposé</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#1e2d42" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Radar name={playerA.name} dataKey="a" stroke="#F97316" fill="#F97316" fillOpacity={0.2} strokeWidth={2} />
                <Radar name={playerB.name} dataKey="b" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e2d42", borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison table */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#1e2d42" }}>
            <table className="w-full text-sm">
              <thead style={{ background: "#0d1626" }}>
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Métrique</th>
                  <th className="px-4 py-3 text-right" style={{ color: "#F97316" }}>{playerA.name}</th>
                  <th className="px-4 py-3 text-right" style={{ color: "#3B82F6" }}>{playerB.name}</th>
                  <th className="px-4 py-3 text-center">Gagnant</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(({ label, key, fmt }) => {
                  const va = playerA[key as keyof PlayerDetail] as number
                  const vb = playerB[key as keyof PlayerDetail] as number
                  const aWins = va != null && vb != null && va > vb
                  const bWins = va != null && vb != null && vb > va
                  return (
                    <tr key={key} className="border-t" style={{ borderColor: "#1a2233" }}>
                      <td className="px-4 py-2.5 text-slate-400">{label}</td>
                      <td className={`px-4 py-2.5 text-right font-mono ${aWins ? "text-orange-400 font-bold" : "text-slate-300"}`}>
                        {fmt(va)}
                      </td>
                      <td className={`px-4 py-2.5 text-right font-mono ${bWins ? "text-blue-400 font-bold" : "text-slate-300"}`}>
                        {fmt(vb)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {aWins ? <span className="text-orange-400">A ✓</span> : bWins ? <span className="text-blue-400">B ✓</span> : <span className="text-slate-600">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Verdict */}
          {verdict && (
            <div className="rounded-xl border p-5" style={{ background: "#111827", borderColor: "#1e2d42" }}>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Verdict</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{verdict}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
