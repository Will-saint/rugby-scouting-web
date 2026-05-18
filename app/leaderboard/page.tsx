import { api } from "@/lib/api"
import { LeaderboardClient } from "./LeaderboardClient"

export const revalidate = 300

interface Props { searchParams: { season?: string } }

export default async function LeaderboardPage({ searchParams }: Props) {
  const seasons = await api.seasons().catch(() => ["2025-2026"])
  const season = seasons.includes(searchParams.season ?? "") ? searchParams.season! : seasons[seasons.length - 1] ?? "2025-2026"

  const [players, teams] = await Promise.all([
    api.leaderboard({ limit: 544, season }),
    api.teams(season),
  ])
  return <LeaderboardClient players={players} teams={teams} seasons={seasons} currentSeason={season} />
}
