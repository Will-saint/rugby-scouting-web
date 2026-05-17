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
    <nav className="sticky top-0 z-50 border-b" style={{ background: "var(--color-paper)", borderColor: "var(--color-line)" }}>
      <div className="max-w-7xl mx-auto px-6 h-14 grid items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--color-ink)", color: "var(--color-paper)" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 20, lineHeight: 1 }}>·</span>
          </div>
          <span className="hidden sm:block font-semibold text-[15px]" style={{ color: "var(--color-ink)", letterSpacing: "-0.01em" }}>
            Rugby Analytics
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="relative whitespace-nowrap text-sm font-medium transition-colors px-3 py-1.5"
              style={{
                color: path.startsWith(n.href) ? "var(--color-ink)" : "var(--color-muted)",
                fontWeight: path.startsWith(n.href) ? 600 : 400,
              }}
            >
              {n.label}
              {path.startsWith(n.href) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" style={{ background: "var(--color-terra)" }} />
              )}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex justify-end">
          <span className="text-xs hidden lg:block" style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
            Top 14 · 25-26
          </span>
        </div>
      </div>
    </nav>
  )
}
