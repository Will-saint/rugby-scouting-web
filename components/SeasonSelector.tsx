"use client"
import { useRouter, usePathname } from "next/navigation"

interface Props {
  seasons: string[]
  current: string
}

export function SeasonSelector({ seasons, current }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs uppercase tracking-widest"
        style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em" }}>
        Saison
      </span>
      <select
        value={current}
        onChange={(e) => router.push(`${pathname}?season=${e.target.value}`)}
        className="font-mono text-sm outline-none rounded-full px-3 py-1.5 border"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          background: "var(--color-paper)",
          borderColor: "var(--color-line-2)",
          color: "var(--color-ink)",
          cursor: "pointer",
        }}
      >
        {seasons.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  )
}
