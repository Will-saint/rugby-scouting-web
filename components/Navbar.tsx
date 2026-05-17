"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { href: "/leaderboard",   label: "Classement" },
  { href: "/compare",       label: "Comparateur" },
  { href: "/composition",   label: "Compo XV" },
  { href: "/team",          label: "Équipes" },
  { href: "/international", label: "International" },
  { href: "/predict",       label: "Prédicteur" },
  { href: "/methodologie",  label: "Méthodo" },
]

export function Navbar() {
  const path = usePathname()
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(8,17,31,0.92)",
        borderColor: "#1E3050",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg shrink-0 group">
          <span className="text-orange-400 group-hover:scale-125 transition-transform inline-block">▶</span>
          <span className="hidden sm:inline tracking-tight">Rugby Analytics</span>
        </Link>
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                path.startsWith(n.href)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <span className="text-xs text-slate-600 hidden lg:block shrink-0">Top 14 · 25-26</span>
      </div>
    </nav>
  )
}
