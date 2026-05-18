import { api } from "@/lib/api"
import { CompositionClient } from "./CompositionClient"

export const revalidate = 300

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010/api/v1"

interface Props { searchParams: { season?: string } }

export default async function CompositionPage({ searchParams }: Props) {
  const seasons = await api.seasons().catch(() => ["2025-2026"])
  const season = seasons.includes(searchParams.season ?? "") ? searchParams.season! : seasons[seasons.length - 1] ?? "2025-2026"

  const [players, teams] = await Promise.all([
    api.players({ limit: 544, season }).then(r => r.players).catch(() => []),
    api.teams(season).then(ts => ts.map(t => t.team)).catch(() => []),
  ])

  return <CompositionClient allPlayers={players} teams={teams} apiBase={API_BASE} />
}
