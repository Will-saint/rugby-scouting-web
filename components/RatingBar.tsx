import { TIER_COLORS } from "@/lib/constants"
import type { Tier } from "@/lib/types"

export function RatingBar({ rating, tier, size = "md" }: { rating: number; tier: Tier; size?: "sm" | "md" | "lg" }) {
  const pct = Math.max(0, Math.min(100, ((rating - 40) / 59) * 100))
  const color = TIER_COLORS[tier]
  const h = size === "sm" ? "h-1" : size === "lg" ? "h-2.5" : "h-1.5"
  return (
    <div className={`w-full bg-white/10 rounded-full ${h} overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}
