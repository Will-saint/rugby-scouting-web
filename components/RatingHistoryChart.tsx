"use client"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts"
import type { SeasonRating } from "@/lib/types"

const TIER_THRESHOLDS = [
  { y: 90, label: "LÉGENDAIRE", color: "#FFD700" },
  { y: 84, label: "OR", color: "#C8A840" },
  { y: 77, label: "ARGENT", color: "#3A7A28" },
  { y: 70, label: "BRONZE", color: "#8C4020" },
]

export function RatingHistoryChart({ history }: { history: SeasonRating[] }) {
  const data = history
    .filter((h) => h.rating != null)
    .map((h) => ({
      season: h.season.replace("20", "").replace("-20", "-"),
      rating: h.rating,
      age: h.age,
    }))

  if (data.length < 2) return null

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#1e2d42" strokeDasharray="3 3" />
        {TIER_THRESHOLDS.map((t) => (
          <ReferenceLine key={t.y} y={t.y} stroke={t.color} strokeDasharray="4 2" strokeOpacity={0.5} />
        ))}
        <XAxis dataKey="season" tick={{ fill: "#64748b", fontSize: 11 }} />
        <YAxis domain={[40, 99]} tick={{ fill: "#64748b", fontSize: 11 }} width={30} />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #1e2d42", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#F97316" }}
          formatter={(v) => [v, "Note"]}
        />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#F97316"
          strokeWidth={2.5}
          dot={{ fill: "#F97316", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
