import { api } from "@/lib/api"
import { LeaderboardClient } from "./LeaderboardClient"

export const revalidate = 300

export default async function LeaderboardPage() {
  const [players, teams] = await Promise.all([
    api.leaderboard({ limit: 544 }),
    api.teams(),
  ])
  return <LeaderboardClient players={players} teams={teams} />
}
