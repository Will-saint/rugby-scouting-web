import { api } from "@/lib/api"
import { CompositionClient } from "./CompositionClient"

export const revalidate = 300

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8010/api/v1"

export default async function CompositionPage() {
  const [players, teams] = await Promise.all([
    api.players({ limit: 544 }).then(r => r.players).catch(() => []),
    api.teams().then(ts => ts.map(t => t.team)).catch(() => []),
  ])

  return <CompositionClient allPlayers={players} teams={teams} apiBase={API_BASE} />
}
