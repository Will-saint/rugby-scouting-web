export type Tier = "LEGENDAIRE" | "OR" | "ARGENT" | "BRONZE" | "STANDARD"
export type FormTrend = "↗" | "→" | "↘"
export type ConfidenceBadge = "Haute" | "Moyenne" | "Basse"

export interface PlayerSummary {
  lnr_slug: string
  name: string
  team: string
  position_group: string
  position_label: string
  rating: number
  tier: Tier
  age: number | null
  height_cm: number | null
  weight_kg: number | null
  nationality: string | null
  photo_url: string | null
  confidence_badge: ConfidenceBadge
}

export interface SeasonRating {
  season: string
  rating: number | null
  age: number | null
  minutes_played: number | null
}

export interface PlayerDetail extends PlayerSummary {
  rating_raw: number | null
  age_factor: number
  intl_bonus: number
  form_score: number | null
  form_trend: string
  minutes_played: number | null
  axis_att: number | null
  axis_def: number | null
  axis_ctrl: number | null
  axis_kick: number | null
  axis_pow: number | null
  axis_gabarit: number | null
  axis_disc: number | null
  tackles_per80: number | null
  offloads_per80: number | null
  line_breaks_per80: number | null
  turnovers_won_per80: number | null
  tries_per80: number | null
  kick_points_per80: number | null
  yellow_cards: number | null
  orange_cards: number | null
  red_cards: number | null
  rating_intl: number | null
  team_intl: string | null
  matches_intl: number | null
  axis_course_intl: number | null
  axis_distrib_intl: number | null
  axis_kicking_intl: number | null
  axis_physique_intl: number | null
  axis_rigueur_intl: number | null
  axis_danger_intl: number | null
  axis_melee_intl: number | null
  history: SeasonRating[]
}

export interface TeamSummary {
  team: string
  avg_rating: number
  tier: Tier
  n_players: number
  top_player: string | null
  rank: number
}

export interface TeamDetail {
  team: string
  season: string
  avg_rating: number
  tier: Tier
  n_players: number
  axes: Record<string, number>
  tier_distribution: Record<string, number>
  roster_by_position: Record<string, PlayerSummary[]>
  top5: PlayerSummary[]
  history: Array<{ season: string; avg_rating: number; n_players: number }>
}

export interface PlayerRank {
  rank: number
  lnr_slug: string
  name: string
  team: string
  position_group: string
  rating: number
  tier: Tier
  age: number | null
  nationality: string | null
  form_trend: string
  confidence_badge: string
}

export interface MatchPrediction {
  home: string
  away: string
  home_rating: number
  away_rating: number
  home_win_pct: number
  away_win_pct: number
  draw_pct: number
  score_home: number
  score_away: number
  key_matchups: Array<{
    axis: string
    home_val: number
    away_val: number
    winner: string
  }>
}

export interface Meta {
  season: string
  n_players: number
  n_teams: number
  avg_rating: number
  top_player: { name: string; rating: number } | null
  last_updated: string | null
}

export interface PlayersResponse {
  total: number
  offset: number
  limit: number
  players: PlayerSummary[]
}
