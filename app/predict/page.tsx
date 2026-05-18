import { api } from "@/lib/api"
import { PredictorClient } from "./PredictorClient"

export const revalidate = 300

interface Props { searchParams: { season?: string } }

export default async function PredictPage({ searchParams }: Props) {
  const seasons = await api.seasons().catch(() => ["2025-2026"])
  const season = seasons.includes(searchParams.season ?? "") ? searchParams.season! : seasons[seasons.length - 1] ?? "2025-2026"
  const teams = await api.teams(season)
  return <PredictorClient teams={teams.map((t) => t.team)} />
}
