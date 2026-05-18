import type {
  PlayerSummary, PlayerDetail, PlayerRank, PlayersResponse,
  TeamSummary, TeamDetail, MatchPrediction, Meta, SeasonRating, InternationalPlayer,
  CommentaryResponse, ScoutResult,
} from "./types"

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010/api/v1"

async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store", ...init })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  seasons: () => fetcher<string[]>("/seasons"),

  meta: (season = "2025-2026") => fetcher<Meta>(`/meta?season=${season}`),

  players: (params: {
    season?: string; position?: string; team?: string
    min_rating?: number; limit?: number; offset?: number
  } = {}) => {
    const qs = new URLSearchParams()
    if (params.season) qs.set("season", params.season)
    if (params.position) qs.set("position", params.position)
    if (params.team) qs.set("team", params.team)
    if (params.min_rating != null) qs.set("min_rating", String(params.min_rating))
    if (params.limit != null) qs.set("limit", String(params.limit))
    if (params.offset != null) qs.set("offset", String(params.offset))
    return fetcher<PlayersResponse>(`/players?${qs}`)
  },

  search: (q: string, season = "2025-2026") =>
    fetcher<PlayerSummary[]>(`/players/search?q=${encodeURIComponent(q)}&season=${season}`),

  player: (slug: string, season = "2025-2026") =>
    fetcher<PlayerDetail>(`/players/${slug}?season=${season}`),

  playerHistory: (slug: string) =>
    fetcher<SeasonRating[]>(`/players/${slug}/history`),

  teams: (season = "2025-2026") =>
    fetcher<TeamSummary[]>(`/teams?season=${season}`),

  team: (name: string, season = "2025-2026") =>
    fetcher<TeamDetail>(`/teams/${encodeURIComponent(name)}?season=${season}`),

  leaderboard: (params: { season?: string; position?: string; team?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams()
    if (params.season) qs.set("season", params.season)
    if (params.position && params.position !== "ALL") qs.set("position", params.position)
    if (params.team && params.team !== "ALL") qs.set("team", params.team)
    if (params.limit != null) qs.set("limit", String(params.limit))
    return fetcher<PlayerRank[]>(`/leaderboard?${qs}`)
  },

  international: (season = "2025-2026") =>
    fetcher<InternationalPlayer[]>(`/international?season=${season}`),

  predict: (home: string, away: string, season = "2025-2026") =>
    fetcher<MatchPrediction>("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home, away, season }),
    }),

  commentary: (slug: string, season = "2025-2026") =>
    fetcher<CommentaryResponse>(`/players/${slug}/commentary?season=${season}`),

  scout: (params: {
    season?: string; position?: string; min_rating?: number
    max_rating?: number; exclude_team?: string; limit?: number; with_ai?: boolean
  } = {}) => {
    const qs = new URLSearchParams()
    if (params.season) qs.set("season", params.season)
    if (params.position && params.position !== "ALL") qs.set("position", params.position)
    if (params.min_rating != null) qs.set("min_rating", String(params.min_rating))
    if (params.max_rating != null) qs.set("max_rating", String(params.max_rating))
    if (params.exclude_team) qs.set("exclude_team", params.exclude_team)
    if (params.limit != null) qs.set("limit", String(params.limit))
    if (params.with_ai != null) qs.set("with_ai", String(params.with_ai))
    return fetcher<ScoutResult>(`/scout?${qs}`)
  },
}
