import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { RatingBar } from "@/components/RatingBar"
import Link from "next/link"
import { POSITION_LABELS } from "@/lib/constants"
import type { InternationalPlayer } from "@/lib/types"

export const revalidate = 300

export default async function InternationalPage() {
  let players: InternationalPlayer[] = []
  try { players = await api.international() } catch { players = [] }

  const countries = Array.from(new Set(players.map((p) => p.team_intl).filter(Boolean))).sort()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🌍</span>
          <h1 className="text-2xl font-bold text-white">Joueurs Internationaux</h1>
        </div>
        <p className="text-slate-500 text-sm">
          {players.length} joueurs capped · double notation T14 + sélection nationale
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Joueurs capped",   value: players.length },
          { label: "Nations",          value: countries.length },
          { label: "Moy. note T14",    value: players.length ? (players.reduce((s, p) => s + p.rating, 0) / players.length).toFixed(1) : "—" },
          { label: "Moy. note intl",   value: players.filter(p => p.rating_intl).length
              ? (players.filter(p => p.rating_intl).reduce((s, p) => s + (p.rating_intl ?? 0), 0) / players.filter(p => p.rating_intl).length).toFixed(1)
              : "—"
          },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border p-4" style={{ background: "#0F1A2E", borderColor: "#1E3050" }}>
            <div className="text-2xl font-bold text-gradient tabular-nums">{value}</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#1E3050" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "#08111F" }}>
            <tr className="text-left text-slate-600 text-xs uppercase tracking-wider">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Joueur</th>
              <th className="px-4 py-3 hidden sm:table-cell">Poste</th>
              <th className="px-4 py-3 hidden md:table-cell">Club T14</th>
              <th className="px-4 py-3">Sélection</th>
              <th className="px-4 py-3 hidden sm:table-cell w-10 text-center">Caps</th>
              <th className="px-4 py-3 w-28">Note T14</th>
              <th className="px-4 py-3 w-28">Note Intl</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr
                key={p.lnr_slug ?? i}
                className="border-t transition-colors hover:bg-white/[0.02]"
                style={{ borderColor: "#162236" }}
              >
                <td className="px-4 py-3 text-slate-600 font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-3">
                  {p.lnr_slug ? (
                    <Link href={`/player/${p.lnr_slug}`} className="hover:text-orange-400 transition-colors font-medium">
                      {p.name}
                    </Link>
                  ) : (
                    <span className="font-medium text-white">{p.name}</span>
                  )}
                  <div className="mt-0.5 flex gap-1 flex-wrap">
                    <TierBadge tier={p.tier} size="xs" />
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell text-xs">
                  {POSITION_LABELS[p.position_group ?? ""] || p.position_group}
                </td>
                <td className="px-4 py-3 text-slate-500 hidden md:table-cell text-xs">{p.team}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    {p.team_intl ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-slate-400 text-xs hidden sm:table-cell">
                  {p.matches_intl ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-400 tabular-nums w-10 text-right">{p.rating}</span>
                    <div className="hidden sm:block flex-1 w-16">
                      <RatingBar rating={p.rating} tier={p.tier} size="sm" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.rating_intl != null ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-400 tabular-nums w-10 text-right">{p.rating_intl}</span>
                      <div className="hidden sm:block flex-1 w-16">
                        <RatingBar rating={p.rating_intl} tier={p.tier_intl} size="sm" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {players.length === 0 && (
          <div className="text-center py-16 text-slate-600">Aucune donnée internationale disponible</div>
        )}
      </div>
    </div>
  )
}
