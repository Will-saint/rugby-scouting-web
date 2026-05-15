import { api } from "@/lib/api"
import { ComparatorClient } from "./ComparatorClient"

export const revalidate = 300

export default async function ComparePage() {
  const allPlayers = await api.leaderboard({ limit: 544 })
  return <ComparatorClient allPlayers={allPlayers} />
}
