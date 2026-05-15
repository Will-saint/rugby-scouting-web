"use client"
import { useState } from "react"
import { api } from "@/lib/api"
import type { MatchPrediction } from "@/lib/types"

export function PredictorClient({ teams }: { teams: string[] }) {
  const [home, setHome] = useState("")
  const [away, setAway] = useState("")
  const [result, setResult] = useState<MatchPrediction | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function predict() {
    if (!home || !away || home === away) return
    setLoading(true)
    setError("")
    try {
      const r = await api.predict(home, away)
      setResult(r)
    } catch {
      setError("Erreur lors de la prédiction")
    } finally {
      setLoading(false)
    }
  }

  const homeWins = result && result.home_win_pct > result.away_win_pct
  const awayWins = result && result.away_win_pct > result.home_win_pct

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Prédicteur de match</h1>
        <p className="text-slate-400 text-sm mt-1">Probabilité de victoire basée sur les notes des effectifs</p>
      </div>

      {/* Team selectors */}
      <div className="rounded-xl border p-6 space-y-4" style={{ background: "#111827", borderColor: "#1e2d42" }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Équipe à domicile</label>
            <select
              value={home}
              onChange={(e) => setHome(e.target.value)}
              className="w-full px-3 py-2.5 rounded border text-sm text-white outline-none"
              style={{ background: "#0d1626", borderColor: "#1e2d42" }}
            >
              <option value="">— Sélectionner —</option>
              {teams.filter((t) => t !== away).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Équipe à l&apos;extérieur</label>
            <select
              value={away}
              onChange={(e) => setAway(e.target.value)}
              className="w-full px-3 py-2.5 rounded border text-sm text-white outline-none"
              style={{ background: "#0d1626", borderColor: "#1e2d42" }}
            >
              <option value="">— Sélectionner —</option>
              {teams.filter((t) => t !== home).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={predict}
          disabled={!home || !away || home === away || loading}
          className="w-full py-3 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Calcul en cours…" : "Prédire le résultat"}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Score + probabilities */}
          <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
            <div className="flex items-center justify-between mb-6">
              <div className={`text-center flex-1 ${homeWins ? "opacity-100" : "opacity-60"}`}>
                <div className="font-bold text-white text-lg">{result.home}</div>
                <div className="text-3xl font-black text-orange-400 mt-1">{result.score_home}</div>
                <div className="text-sm text-slate-400 mt-1">Note moy. {result.home_rating}</div>
              </div>
              <div className="text-center px-6">
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest">VS</div>
              </div>
              <div className={`text-center flex-1 ${awayWins ? "opacity-100" : "opacity-60"}`}>
                <div className="font-bold text-white text-lg">{result.away}</div>
                <div className="text-3xl font-black text-blue-400 mt-1">{result.score_away}</div>
                <div className="text-sm text-slate-400 mt-1">Note moy. {result.away_rating}</div>
              </div>
            </div>

            {/* Probability bar */}
            <div className="space-y-2">
              <div className="flex text-xs font-semibold">
                <span className="text-orange-400">{result.home_win_pct}%</span>
                <span className="flex-1 text-center text-slate-500">Nul {result.draw_pct}%</span>
                <span className="text-blue-400">{result.away_win_pct}%</span>
              </div>
              <div className="flex rounded-full overflow-hidden h-3">
                <div className="bg-orange-500 transition-all" style={{ width: `${result.home_win_pct}%` }} />
                <div className="bg-slate-600 transition-all" style={{ width: `${result.draw_pct}%` }} />
                <div className="bg-blue-500 transition-all" style={{ width: `${result.away_win_pct}%` }} />
              </div>
            </div>
          </div>

          {/* Key matchups */}
          <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Duels clés</h3>
            <div className="space-y-3">
              {result.key_matchups.map((m) => {
                const homeLeads = m.home_val > m.away_val
                return (
                  <div key={m.axis} className="flex items-center gap-3 text-sm">
                    <span className="text-slate-400 w-24 shrink-0">{m.axis}</span>
                    <span className={`font-mono tabular-nums w-10 text-right ${homeLeads ? "text-orange-400 font-bold" : "text-slate-400"}`}>
                      {m.home_val}
                    </span>
                    <div className="flex-1 flex gap-0.5 h-1.5">
                      <div className="flex-1 bg-white/10 rounded-l-full overflow-hidden flex justify-end">
                        <div className="bg-orange-500 h-full rounded-l-full" style={{ width: `${m.home_val}%` }} />
                      </div>
                      <div className="flex-1 bg-white/10 rounded-r-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-r-full" style={{ width: `${m.away_val}%` }} />
                      </div>
                    </div>
                    <span className={`font-mono tabular-nums w-10 ${!homeLeads ? "text-blue-400 font-bold" : "text-slate-400"}`}>
                      {m.away_val}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-xs text-slate-600 text-center">
            Prédiction basée sur les notes moyennes des effectifs — algorithme logistique.
            Ne tient pas compte des absences ou conditions terrain.
          </p>
        </div>
      )}
    </div>
  )
}
