import { api } from "@/lib/api"
import { ScoutClient } from "./ScoutClient"

export const revalidate = 3600

export default async function ScoutPage() {
  const [seasons, teams] = await Promise.all([
    api.seasons().catch(() => ["2025-2026"]),
    api.teams().catch(() => []).then(t => t.map((x: { team: string }) => x.team).sort()),
  ])
  return <ScoutClient seasons={seasons} teams={teams} />
}
