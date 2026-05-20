import { notFound } from "next/navigation"
import { api } from "@/lib/api"
import { PresentationView } from "./PresentationView"

export const dynamic = "force-dynamic"

interface Props { params: { slug: string }; searchParams: { season?: string } }

export default async function PresentationPage({ params, searchParams }: Props) {
  const seasons = await api.seasons().catch(() => ["2025-2026"])
  const season = seasons.includes(searchParams.season ?? "")
    ? searchParams.season!
    : seasons[seasons.length - 1] ?? "2025-2026"

  let player
  try { player = await api.player(params.slug, season) } catch { notFound() }

  return <PresentationView player={player} season={season} slug={params.slug} />
}
