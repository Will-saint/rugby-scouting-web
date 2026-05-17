export const TIER_COLORS: Record<string, string> = {
  LEGENDAIRE: "#c89d4a",
  OR:         "#c89d4a",
  ARGENT:     "#1a3a2e",
  BRONZE:     "#b94f3a",
  STANDARD:   "#5a5a4e",
}

export const TIER_BG: Record<string, string> = {
  LEGENDAIRE: "bg-yellow-900/15 text-yellow-700 border-yellow-700/30",
  OR:         "bg-amber-800/12 text-amber-700 border-amber-700/30",
  ARGENT:     "bg-green-900/12 text-green-800 border-green-800/25",
  BRONZE:     "bg-red-900/10 text-red-700 border-red-700/25",
  STANDARD:   "bg-stone-200/60 text-stone-600 border-stone-400/30",
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
  t14: "#b94f3a",
  intl: "#1a3a2e",
}

export const POSITIONS = [
  "ALL","FRONT_ROW","LOCK","BACK_ROW","SCRUM_HALF","FLY_HALF","CENTRE","WINGER","FULLBACK",
]

export const TEAMS = [
  "ALL","Bayonne","Bordeaux-Bègles","Brive","Castres","Clermont","La Rochelle",
  "Lyon","Montpellier","Pau","Perpignan","Racing 92","Stade Français","Toulon","Toulouse",
]
