import { TIER_BG } from "@/lib/constants"

const TIER_GLOW: Record<string, string> = {
  LEGENDAIRE: "shadow-[0_0_10px_rgba(255,215,0,0.45)]",
  OR:         "shadow-[0_0_8px_rgba(200,168,64,0.35)]",
  ARGENT:     "shadow-[0_0_6px_rgba(100,180,80,0.25)]",
}

export function TierBadge({ tier, size = "sm" }: { tier: string; size?: "xs" | "sm" | "lg" }) {
  const sz =
    size === "xs" ? "text-[10px] px-1.5 py-0.5" :
    size === "lg" ? "text-sm px-3 py-1" :
    "text-xs px-2 py-0.5"
  return (
    <span className={`inline-block rounded border font-semibold tracking-wider ${sz} ${TIER_BG[tier] || ""} ${TIER_GLOW[tier] || ""}`}>
      {tier}
    </span>
  )
}
