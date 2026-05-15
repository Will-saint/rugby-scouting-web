import { api } from "@/lib/api"
import { PredictorClient } from "./PredictorClient"

export const revalidate = 300

export default async function PredictPage() {
  const teams = await api.teams()
  return <PredictorClient teams={teams.map((t) => t.team)} />
}
