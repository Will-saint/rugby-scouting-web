"use client"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend
} from "recharts"

const AXES = [
  { key: "axis_att", label: "Attaque" },
  { key: "axis_def", label: "Défense" },
  { key: "axis_ctrl", label: "Contrôle" },
  { key: "axis_kick", label: "Jeu au pied" },
  { key: "axis_pow", label: "Puissance" },
  { key: "axis_gabarit", label: "Physique" },
  { key: "axis_disc", label: "Discipline" },
]

interface Props {
  data: Record<string, number | null>
  intlData?: Record<string, number | null>
  compareData?: Record<string, number | null>
  compareLabel?: string
  playerName?: string
  height?: number
}

const INTL_AXIS_MAP: Record<string, string> = {
  axis_att: "axis_danger_intl",
  axis_def: "axis_rigueur_intl",
  axis_ctrl: "axis_distrib_intl",
  axis_kick: "axis_kicking_intl",
  axis_pow: "axis_danger_intl",
  axis_gabarit: "axis_physique_intl",
  axis_disc: "axis_rigueur_intl",
}

export function PlayerRadar({ data, intlData, compareData, compareLabel, playerName, height = 300 }: Props) {
  const hasIntl = intlData && Object.values(intlData).some((v) => v != null)
  const hasCompare = compareData && Object.values(compareData).some((v) => v != null)

  const chartData = AXES.map(({ key, label }) => {
    const t14 = data[key] ?? 0
    const intlKey = INTL_AXIS_MAP[key]
    const intl = hasIntl ? (intlData![intlKey] ?? intlData![key] ?? 0) : undefined
    const compare = hasCompare ? (compareData![key] ?? 0) : undefined
    return { axis: label, t14, ...(intl !== undefined ? { intl } : {}), ...(compare !== undefined ? { compare } : {}) }
  })

  const showLegend = hasIntl || hasCompare

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#1e2d42" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <Radar
          name={playerName || "Saison actuelle"}
          dataKey="t14"
          stroke="#F97316"
          fill="#F97316"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        {hasIntl && (
          <Radar
            name="International"
            dataKey="intl"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        )}
        {hasCompare && (
          <Radar
            name={compareLabel || "Saison comparée"}
            dataKey="compare"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="4 2"
          />
        )}
        {showLegend && <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />}
      </RadarChart>
    </ResponsiveContainer>
  )
}
