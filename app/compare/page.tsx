import { Suspense } from "react"
import { api } from "@/lib/api"
import { ComparatorClient } from "./ComparatorClient"

export const revalidate = 300

export default async function ComparePage() {
  const allPlayers = await api.leaderboard({ limit: 544 })
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8 text-slate-400">Chargement…</div>}>
      <ComparatorClient allPlayers={allPlayers} />
    </Suspense>
  )
}
