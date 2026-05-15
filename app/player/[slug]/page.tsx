import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { PlayerRadar } from "@/components/PlayerRadar"
import { RatingHistoryChart } from "@/components/RatingHistoryChart"
import { POSITION_LABELS, TIER_COLORS } from "@/lib/constants"

export const revalidate = 300

interface Props { params: { slug: string } }

export default async function PlayerPage({ params }: Props) {
  let player
  try { player = await api.player(params.slug) } catch { notFound() }

  const tier = player.tier
  const accentColor = TIER_COLORS[tier]

  const axes = {
    axis_att: player.axis_att,
    axis_def: player.axis_def,
    axis_ctrl: player.axis_ctrl,
    axis_kick: player.axis_kick,
    axis_pow: player.axis_pow,
    axis_gabarit: player.axis_gabarit,
    axis_disc: player.axis_disc,
  }

  const intlAxes = player.rating_intl ? {
    axis_course_intl: player.axis_course_intl,
    axis_distrib_intl: player.axis_distrib_intl,
    axis_kicking_intl: player.axis_kicking_intl,
    axis_physique_intl: player.axis_physique_intl,
    axis_rigueur_intl: player.axis_rigueur_intl,
    axis_danger_intl: player.axis_danger_intl,
    axis_melee_intl: player.axis_melee_intl,
  } : undefined

  const statRows = [
    { label: "Plaquages/80", value: player.tackles_per80, unit: "" },
    { label: "Offloads/80", value: player.offloads_per80, unit: "" },
    { label: "Franchissements/80", value: player.line_breaks_per80, unit: "" },
    { label: "Ballons récupérés/80", value: player.turnovers_won_per80, unit: "" },
    { label: "Essais/80", value: player.tries_per80, unit: "" },
    { label: "Pts au pied/80", value: player.kick_points_per80, unit: "" },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 flex items-center gap-2">
        <Link href="/leaderboard" className="hover:text-orange-400 transition-colors">Classement</Link>
        <span>/</span>
        <span className="text-slate-300">{player.name}</span>
      </div>

      {/* Banner */}
      <div
        className="rounded-2xl p-6 border flex flex-col sm:flex-row gap-6 items-start sm:items-center"
        style={{ background: "#111827", borderColor: "#1e2d42" }}
      >
        {/* Photo */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-800 border" style={{ borderColor: "#1e2d42" }}>
          {player.photo_url ? (
            <Image
              src={player.photo_url}
              alt={player.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🏉</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{player.name}</h1>
            <TierBadge tier={tier} size="lg" />
            {player.rating_intl && (
              <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-medium">
                {player.team_intl} · {player.matches_intl} caps
              </span>
            )}
          </div>
          <div className="text-slate-400 text-sm flex flex-wrap gap-x-4 gap-y-1">
            <span>{POSITION_LABELS[player.position_group] || player.position_group}</span>
            <span>·</span>
            <span>{player.team}</span>
            {player.nationality && <><span>·</span><span>{player.nationality}</span></>}
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <span className="text-3xl font-bold" style={{ color: accentColor }}>{player.rating}</span>
              <span className="text-slate-500 ml-1 text-sm">/ 99</span>
            </div>
            <div className="text-sm text-slate-400 space-x-3">
              {player.age && <span>{player.age} ans</span>}
              {player.height_cm && <span>{player.height_cm} cm</span>}
              {player.weight_kg && <span>{player.weight_kg} kg</span>}
            </div>
            <div className="text-sm text-slate-400 flex gap-2">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">
                {player.form_trend} Forme 5M: {player.form_score != null ? Math.round(player.form_score) : "—"}/100
              </span>
              {player.form_score_10 != null && (
                <span className="bg-slate-800 px-2 py-0.5 rounded text-xs text-slate-300">
                  {player.form_trend_10} 10M: {Math.round(player.form_score_10)}/100
                </span>
              )}
              <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">
                Confiance {player.confidence_badge}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0">
          <Link
            href={`/compare?a=${params.slug}`}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition-colors"
          >
            Comparer →
          </Link>
        </div>
      </div>

      {/* Radar + Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Radar 7 axes {player.rating_intl ? "· T14 + International" : ""}
          </h2>
          <PlayerRadar
            data={axes as Record<string, number | null>}
            intlData={intlAxes as Record<string, number | null> | undefined}
            playerName={player.name}
            height={280}
          />
        </div>

        {/* Stats + Rating breakdown */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="rounded-xl border p-5" style={{ background: "#111827", borderColor: "#1e2d42" }}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Stats clés (par 80 min)</h2>
            <div className="grid grid-cols-2 gap-3">
              {statRows.map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                  <div className="font-semibold text-white">
                    {value != null ? value.toFixed(2) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="rounded-xl border p-5 space-y-2" style={{ background: "#111827", borderColor: "#1e2d42" }}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Détail de la note</h2>
            <div className="space-y-1.5 text-sm">
              {[
                { label: "Note brute (performance)", val: player.rating_raw, color: "text-white" },
                { label: "Courbe d'âge", val: player.age_factor !== 0 ? `${player.age_factor > 0 ? "+" : ""}${player.age_factor.toFixed(2)}` : "—", color: player.age_factor >= 0 ? "text-green-400" : "text-red-400" },
                { label: "Bonus international", val: player.intl_bonus > 0 ? `+${player.intl_bonus.toFixed(2)}` : "—", color: "text-blue-400" },
                { label: "Forme (blend 20%)", val: player.form_score != null ? `${Math.round(player.form_score)}/100` : "—", color: "text-slate-300" },
                { label: "Note finale", val: player.rating, color: "text-orange-400 font-bold" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between items-center py-1 border-b" style={{ borderColor: "#1a2233" }}>
                  <span className="text-slate-400">{label}</span>
                  <span className={color}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Discipline */}
          {(player.yellow_cards || player.red_cards || player.orange_cards) ? (
            <div className="rounded-xl border p-4 flex gap-4 text-sm" style={{ background: "#111827", borderColor: "#1e2d42" }}>
              <span className="text-slate-400">Discipline :</span>
              {player.yellow_cards ? <span className="text-yellow-400">{player.yellow_cards}×🟡</span> : null}
              {player.orange_cards ? <span className="text-orange-400">{player.orange_cards}×🟠</span> : null}
              {player.red_cards ? <span className="text-red-400">{player.red_cards}×🔴</span> : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* History chart */}
      {player.history.length > 1 && (
        <div className="rounded-xl border p-6" style={{ background: "#111827", borderColor: "#1e2d42" }}>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Évolution de la note — {player.history.length} saisons
          </h2>
          <RatingHistoryChart history={player.history} />
        </div>
      )}
    </div>
  )
}
