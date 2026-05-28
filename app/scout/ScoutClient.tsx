"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { api } from "@/lib/api"
import type { ScoutResult, PlayerSummary } from "@/lib/types"
import { TierBadge } from "@/components/TierBadge"
import { POSITIONS, POSITION_LABELS } from "@/lib/constants"

const POSITIONS_SCOUT = POSITIONS.filter(p => p !== "ALL")

interface Props { seasons: string[]; teams: string[] }

export function ScoutClient({ seasons, teams }: Props) {
  const [season, setSeason] = useState(seasons[seasons.length - 1] ?? "2025-2026")
  const [position, setPosition] = useState("ALL")
  const [minRating, setMinRating] = useState(70)
  const [maxRating, setMaxRating] = useState(99)
  const [excludeTeam, setExcludeTeam] = useState("ALL")
  const [result, setResult] = useState<ScoutResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [ran, setRan] = useState(false)

  const search = async () => {
    setLoading(true)
    setRan(true)
    try {
      const r = await api.scout({
        season,
        position: position !== "ALL" ? position : undefined,
        min_rating: minRating,
        max_rating: maxRating,
        exclude_team: excludeTeam !== "ALL" ? excludeTeam : undefined,
        limit: 12,
        with_ai: true,
      })
      setResult(r)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const selStyle = {
    background: "var(--color-paper)",
    borderColor: "var(--color-line-2)",
    color: "var(--color-ink)",
    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
    border: "1px solid var(--color-line-2)",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 14,
    outline: "none",
    width: "100%",
  } as React.CSSProperties

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0" }}>
      {/* Header */}
      <div className="px-6 sm:px-12 pt-12 pb-8 border-b" style={{ borderColor: "var(--color-line)" }}>
        <p className="font-mono text-xs mb-3 tracking-wider" style={{ color: "var(--color-terra)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em" }}>
          OUTIL DE RECRUTEMENT
        </p>
        <h1 className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 52, fontWeight: 400, lineHeight: 1 }}>
          Scout <em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>IA</em>
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--color-muted)", maxWidth: 480 }}>
          Décris le profil recherché, l&apos;IA identifie les meilleurs matchs parmi 544 joueurs Top 14 et rédige une analyse recrutement.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 sm:px-12 py-8 border-b" style={{ borderColor: "var(--color-line)" }}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono mb-2 uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Poste</label>
            <select value={position} onChange={e => setPosition(e.target.value)} style={selStyle}>
              <option value="ALL">Tous les postes</option>
              {POSITIONS_SCOUT.map(p => <option key={p} value={p}>{POSITION_LABELS[p] || p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono mb-2 uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Note cible</label>
            <div className="flex gap-2 items-center">
              <input
                type="number" min={40} max={99} value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                style={{ ...selStyle, width: 70, textAlign: "center" }}
              />
              <span style={{ color: "var(--color-muted)" }}>→</span>
              <input
                type="number" min={40} max={99} value={maxRating}
                onChange={e => setMaxRating(Number(e.target.value))}
                style={{ ...selStyle, width: 70, textAlign: "center" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono mb-2 uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Exclure équipe</label>
            <select value={excludeTeam} onChange={e => setExcludeTeam(e.target.value)} style={selStyle}>
              <option value="ALL">Aucune exclusion</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono mb-2 uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>Saison</label>
            <select value={season} onChange={e => setSeason(e.target.value)} style={selStyle}>
              {seasons.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={search}
          disabled={loading}
          className="mt-6 px-8 py-3 rounded-full text-sm font-semibold transition-all"
          style={{
            background: loading ? "var(--color-muted)" : "var(--color-forest)",
            color: "var(--color-paper)",
            cursor: loading ? "not-allowed" : "pointer",
            border: "none",
          }}
        >
          {loading ? "Analyse en cours…" : "Lancer la recherche →"}
        </button>
      </div>

      {/* Results */}
      {ran && (
        <div className="px-6 sm:px-12 py-8">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--color-paper-2)" }} />
              ))}
            </div>
          ) : !result ? (
            <p style={{ color: "var(--color-muted)" }}>Une erreur est survenue.</p>
          ) : result.players.length === 0 ? (
            <p style={{ color: "var(--color-muted)" }}>Aucun joueur ne correspond à ce profil.</p>
          ) : (
            <div className="space-y-6">
              {/* AI Summary */}
              {result.ai_summary && (
                <div className="rounded-xl p-5 border" style={{ background: "#0f1a2a", borderColor: "#1a3a2e" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: "#4ade80", letterSpacing: "0.12em" }}>
                      Analyse IA
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: 10 }}>
                      Claude Haiku
                    </span>
                    <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {result.total} profil{result.total > 1 ? "s" : ""} trouvé{result.total > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {result.ai_summary}
                  </p>
                </div>
              )}

              {/* Player grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.players.map((p: PlayerSummary, i: number) => (
                  <Link
                    key={p.lnr_slug}
                    href={`/player/${p.lnr_slug}`}
                    className="group rounded-xl border p-4 flex gap-3 items-start transition-colors hover:border-stone-400"
                    style={{ background: "var(--color-paper)", borderColor: "var(--color-line)" }}
                  >
                    {/* Rank */}
                    <span className="font-serif italic shrink-0 w-6 text-right" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "var(--color-muted)", fontSize: 20, fontStyle: "italic" }}>
                      {i + 1}
                    </span>
                    {/* Photo */}
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                      {p.photo_url ? (
                        <Image src={p.photo_url} alt={p.name ?? ""} fill className="object-cover object-top" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🏉</div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate group-hover:underline" style={{ color: "var(--color-ink)", textDecorationColor: "var(--color-terra)" }}>
                        {p.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                        {p.team} · {POSITION_LABELS[p.position_group] || p.position_group}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-serif italic font-semibold" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, color: "var(--color-ink)" }}>
                          {p.rating}
                        </span>
                        <TierBadge tier={p.tier} size="xs" />
                        {p.rating_intl && (
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa", fontSize: 10 }}>
                            Intl
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
