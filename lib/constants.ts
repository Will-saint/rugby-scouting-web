import type { Tier } from "./types"

export const TIER_COLORS: Record<Tier, string> = {
  LEGENDAIRE: "#FFD700",
  OR: "#C8A840",
  ARGENT: "#3A7A28",
  BRONZE: "#8C4020",
  STANDARD: "#585858",
}

export const TIER_BG: Record<Tier, string> = {
  LEGENDAIRE: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
  OR: "bg-amber-400/20 text-amber-300 border-amber-400/40",
  ARGENT: "bg-green-600/20 text-green-400 border-green-600/40",
  BRONZE: "bg-orange-700/20 text-orange-400 border-orange-700/40",
  STANDARD: "bg-zinc-600/20 text-zinc-400 border-zinc-600/40",
}

export const POSITION_LABELS: Record<string, string> = {
  FRONT_ROW: "1ère ligne",
  LOCK: "2ème ligne",
  BACK_ROW: "3ème ligne",
  SCRUM_HALF: "Demi de mêlée",
  FLY_HALF: "Demi d'ouverture",
  CENTRE: "Centre",
  WINGER: "Ailier",
  FULLBACK: "Arrière",
}

export const AXIS_LABELS: Record<string, string> = {
  axis_att: "Attaque",
  axis_def: "Défense",
  axis_ctrl: "Contrôle",
  axis_kick: "Jeu au pied",
  axis_pow: "Puissance",
  axis_gabarit: "Physique",
  axis_disc: "Discipline",
}

export const AXIS_COLORS = {
  t14: "#F97316",
  intl: "#3B82F6",
}

export const POSITIONS = [
  "ALL",
  "FRONT_ROW",
  "LOCK",
  "BACK_ROW",
  "SCRUM_HALF",
  "FLY_HALF",
  "CENTRE",
  "WINGER",
  "FULLBACK",
]

export const TEAMS = [
  "ALL",
  "Bayonne",
  "Bordeaux-Bègles",
  "Brive",
  "Castres",
  "Clermont",
  "La Rochelle",
  "Lyon",
  "Montpellier",
  "Pau",
  "Perpignan",
  "Racing 92",
  "Stade Français",
  "Toulon",
  "Toulouse",
]
