export type Tier = "LEGENDAIRE" | "OR" | "ARGENT" | "BRONZE" | "STANDARD"
export type FormTrend = "↗" | "→" | "↘"
export type ConfidenceBadge = "Haute" | "Moyenne" | "Basse"

export interface AwardBadge {
  id: string
  label: string
  short: string
  year: number | null
  icon: string
  color: string
}

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
  rating_intl: number | null
  badges: AwardBadge[]
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
  form_score_10: number | null
  form_trend: string
  form_trend_10: string | null
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
  // Raw Naim intl stats (per-game averages from ESPN)
  meters_run_intl: number | null
  clean_breaks_intl: number | null
  defenders_beaten_intl: number | null
  passes_intl: number | null
  runs_intl: number | null
  lineouts_won_intl: number | null
  missed_tackles_intl: number | null
  tackles_intl: number | null
  turnovers_conceded_intl: number | null
  penalties_conceded_intl: number | null
  offloads_intl: number | null
  history: SeasonRating[]
}

export interface TeamSummary {
  team: string
  avg_rating: number
  tier: Tier
  n_players: number
  top_player: string | null
  rank: number
  // LNR standings
  lnr_rank: number | null
  played: number | null
  won: number | null
  drawn: number | null
  lost: number | null
  bonus_off: number | null
  bonus_def: number | null
  pts_for: number | null
  pts_against: number | null
  points: number | null
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
  badges: AwardBadge[]
  matches_played: number | null
}

export interface InternationalPlayer {
  lnr_slug: string | null
  name: string | null
  team: string | null
  position_group: string | null
  rating: number
  tier: string
  rating_intl: number | null
  tier_intl: string
  team_intl: string | null
  matches_intl: number | null
  nationality: string | null
}

export interface CommentaryResponse {
  commentary: string | null
  available: boolean
}

export interface ScoutResult {
  players: PlayerSummary[]
  total: number
  criteria: {
    position: string | null
    min_rating: number
    max_rating: number
    exclude_team: string | null
    season: string
  }
  ai_summary: string | null
  ai_available: boolean
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

export interface PredictCalibration {
  brier_score: number | null
  accuracy: number | null
  n_matches: number
}

export interface PlayersResponse {
  total: number
  offset: number
  limit: number
  players: PlayerSummary[]
}
