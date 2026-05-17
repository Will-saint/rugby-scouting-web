import { TIER_COLORS } from "@/lib/constants"

export function RatingBar({ rating, tier, size = "md" }: { rating: number; tier: string; size?: "sm" | "md" | "lg" }) {
  const pct = Math.max(0, Math.min(100, ((rating - 40) / 59) * 100))
  const color = TIER_COLORS[tier] || "#5a5a4e"
  const h = size === "sm" ? "h-1" : size === "lg" ? "h-2.5" : "h-1.5"
  return (
    <div className={`w-full rounded-full ${h} overflow-hidden`} style={{ background: "var(--color-paper-3)" }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}
