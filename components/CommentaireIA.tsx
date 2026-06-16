"use client"
import { useState } from "react"
import { api } from "@/lib/api"

interface Props { slug: string; season: string }

export function CommentaireIA({ slug, season }: Props) {
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [triggered, setTriggered] = useState(false)
  const [available, setAvailable] = useState(true)

  function generate() {
    setTriggered(true)
    setLoading(true)
    api.commentary(slug, season)
      .then(r => { setText(r.commentary); setAvailable(r.available) })
      .catch(() => setAvailable(false))
      .finally(() => setLoading(false))
  }

  if (!available && triggered) return null

  return (
    <div className="rounded-xl border p-5" style={{ background: "#111827", borderColor: "#1e2d42" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-terra)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
          Analyse IA
        </span>
        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(185,79,58,0.15)", color: "var(--color-terra)", fontSize: 10 }}>
          Claude Haiku
        </span>
      </div>
      {!triggered ? (
        <button
          onClick={generate}
          className="text-sm px-3 py-1.5 rounded-lg border transition-colors hover:opacity-80"
          style={{ borderColor: "var(--color-terra)", color: "var(--color-terra)", background: "rgba(185,79,58,0.08)" }}
        >
          Générer l'analyse →
        </button>
      ) : loading ? (
        <div className="space-y-2">
          {[80, 95, 65].map((w, i) => (
            <div key={i} className="h-3.5 rounded animate-pulse" style={{ width: `${w}%`, background: "rgba(255,255,255,0.06)" }} />
          ))}
        </div>
      ) : (
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}>
          {text}
        </p>
      )}
    </div>
  )
}
