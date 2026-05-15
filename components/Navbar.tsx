"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/leaderboard",  label: "Classement" },
  { href: "/compare",      label: "Comparateur" },
  { href: "/composition",  label: "Compo XV" },
  { href: "/team",         label: "Équipes" },
  { href: "/predict",      label: "Prédicteur" },
]

export function Navbar() {
  const path = usePathname()
  return (
    <nav className="border-b sticky top-0 z-50" style={{ background: "#0d1626", borderColor: "#1e2d42" }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg shrink-0">
          <span className="text-orange-400">▶</span>
          <span>Rugby Analytics</span>
        </Link>
        <div className="flex items-center gap-1 flex-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                path.startsWith(n.href)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <span className="text-xs text-slate-500 hidden sm:block">Top 14 · 2025-2026</span>
      </div>
    </nav>
  )
}
