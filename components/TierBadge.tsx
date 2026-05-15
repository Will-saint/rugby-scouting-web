import type { Tier } from "@/lib/types"
import { TIER_BG } from "@/lib/constants"

export function TierBadge({ tier, size = "sm" }: { tier: Tier; size?: "xs" | "sm" | "lg" }) {
  const sz = size === "xs" ? "text-[10px] px-1.5 py-0.5" : size === "lg" ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5"
  return (
    <span className={`inline-block rounded border font-semibold tracking-wider ${sz} ${TIER_BG[tier]}`}>
      {tier}
    </span>
  )
}
