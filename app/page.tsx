import Link from "next/link"
import { api } from "@/lib/api"
import { TierBadge } from "@/components/TierBadge"
import { RatingBar } from "@/components/RatingBar"
import { POSITION_LABELS } from "@/lib/constants"

export const revalidate = 300

async function getMeta() { try { return await api.meta() } catch { return null } }
async function getTop5() { try { return await api.leaderboard({ limit: 5 }) } catch { return [] } }

const MODULES = [
  { href: "/leaderboard",   glyph: "i.",   label: "Classement",    desc: "544 joueurs filtrables par poste, équipe et tier.", variant: "paper" },
  { href: "/compare",       glyph: "ii.",  label: "Comparateur",   desc: "Radar superposé, verdict de recrutement en un coup d'œil.", variant: "forest" },
  { href: "/composition",   glyph: "iii.", label: "Compo XV",      desc: "Construis ton XV idéal, score collectif en temps réel.", variant: "terra" },
  { href: "/international", glyph: "iv.",  label: "International", desc: "Joueurs capped, dual ranking T14 vs sélection nationale.", variant: "ink" },
  { href: "/team",          glyph: "v.",   label: "Équipes",       desc: "Force par club, distribution des tiers, historique saisons.", variant: "paper" },
  { href: "/predict",       glyph: "vi.",  label: "Prédicteur",    desc: "Probabilité de victoire basée sur la force des effectifs.", variant: "forest" },
  { href: "/methodologie",  glyph: "vii.", label: "Méthodologie",  desc: "Comprendre le système de notation FIFA-style Rugby.", variant: "paper" },
]

const MOD_STYLE: Record<string, { bg: string; color: string; glyphColor: string }> = {
  paper:  { bg: "var(--color-paper-2)",  color: "var(--color-ink)",    glyphColor: "var(--color-terra)" },
  forest: { bg: "var(--color-forest)",   color: "var(--color-paper)",  glyphColor: "rgba(243,237,224,0.4)" },
  terra:  { bg: "var(--color-terra)",    color: "var(--color-paper)",  glyphColor: "rgba(243,237,224,0.4)" },
  ink:    { bg: "var(--color-ink)",      color: "var(--color-paper)",  glyphColor: "var(--color-ochre)" },
}

export default async function HomePage() {
  const [meta, top5] = await Promise.all([getMeta(), getTop5()])
  const top1 = top5[0]

  return (
    <div>
      {/* Date strip */}
      <div className="flex justify-between px-6 sm:px-12 py-3 border-b font-mono text-xs"
        style={{ borderColor: "var(--color-line)", color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
        <span>Saison 2025/26 · Données à jour</span>
        <span className="hidden sm:block">544 joueurs · 14 clubs · 6 saisons</span>
      </div>

      {/* Hero */}
      <section className="px-6 sm:px-12 pt-16 pb-20 grid gap-16" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div>
          <div className="flex items-center gap-3 mb-7 font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--color-terra)", fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="w-8 h-px" style={{ background: "var(--color-terra)" }} />
            Édition de la semaine
          </div>
          <h1 className="font-serif mb-0" style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: "clamp(72px, 10vw, 140px)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            fontWeight: 400,
            color: "var(--color-ink)"
          }}>
            Le rugby,<br />
            <em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>décodé</em> en<br />
            <span style={{ textDecoration: "underline", textDecorationColor: "var(--color-terra)", textDecorationThickness: 4, textUnderlineOffset: 4 }}>données</span>.
          </h1>
        </div>

        <div className="border-l pl-10 pb-3 flex flex-col justify-end" style={{ borderColor: "var(--color-line)" }}>
          <p className="font-serif italic mb-5" style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontStyle: "italic",
            fontSize: 20,
            lineHeight: 1.35,
            color: "var(--color-ink-2)"
          }}>
            &ldquo;Un outil qui ne raconte pas le rugby — il le mesure, joueur par joueur, mêlée par mêlée.&rdquo;
          </p>
          <div className="font-mono text-xs tracking-widest uppercase mb-7" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            — Une notation FIFA-style pour le Top 14
          </div>
          <div className="flex gap-3">
            <Link href="/leaderboard" className="px-5 py-3 rounded-full text-sm font-semibold transition-colors"
              style={{ background: "var(--color-terra)", color: "var(--color-paper)" }}>
              Explorer le classement →
            </Link>
            <Link href="/methodologie" className="px-5 py-3 rounded-full text-sm font-medium border transition-colors"
              style={{ border: "1px solid var(--color-ink)", color: "var(--color-ink)" }}>
              Méthodologie
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {meta && (
        <div className="grid border-y" style={{ gridTemplateColumns: "repeat(4, 1fr)", background: "var(--color-forest)", borderColor: "var(--color-ink)" }}>
          {[
            { v: meta.n_players, l: "Joueurs scorés" },
            { v: meta.n_teams,   l: "Clubs analysés" },
            { v: meta.avg_rating, l: "Note moyenne" },
            { v: 6,              l: "Saisons d'historique" },
          ].map(({ v, l }, i) => (
            <div key={l} className="flex flex-col gap-1 px-8 py-6" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
              <div className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 64, lineHeight: 0.9, color: "var(--color-paper)" }}>
                {v}
              </div>
              <div className="font-mono text-xs tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(243,237,224,0.65)", letterSpacing: "0.12em" }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured player */}
      {top1 && (
        <section className="px-6 sm:px-12 py-20 grid gap-14" style={{ gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--color-line)" }}>
          {/* Photo placeholder */}
          <div className="relative rounded-lg overflow-hidden border" style={{ aspectRatio: "4/5", background: "repeating-linear-gradient(45deg, var(--color-paper-2) 0 16px, var(--color-paper-3) 16px 17px)", borderColor: "var(--color-line)" }}>
            <div className="absolute inset-6 border border-dashed" style={{ borderColor: "rgba(24,27,22,0.25)" }} />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
              [ photo joueur · 4:5 ]
            </div>
            {/* Rating badge */}
            <div className="absolute top-6 right-6 w-24 h-24 rounded-full flex flex-col items-center justify-center font-serif italic"
              style={{ background: "var(--color-terra)", color: "var(--color-paper)", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 38, lineHeight: 0.9, transform: "rotate(-8deg)" }}>
              {Math.round(top1.rating)}
              <small className="font-mono not-italic mt-1" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.15em" }}>NOTE</small>
            </div>
            {/* Tag */}
            <div className="absolute bottom-6 left-6 px-3 py-1.5 font-mono text-xs tracking-widest"
              style={{ background: "var(--color-ink)", color: "var(--color-paper)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
              {top1.team} · {top1.position_group}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: "var(--color-terra)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
              ↑ Joueur N°1 · Top 14 2025-2026
            </div>
            <h2 className="font-serif mb-1.5" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 72, lineHeight: 0.9, fontWeight: 400 }}>
              {top1.name.split(" ")[0]}<br />
              <em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>{top1.name.split(" ").slice(1).join(" ")}</em>
            </h2>
            <div className="font-mono text-xs tracking-wider uppercase mb-7" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
              {top1.team} · {POSITION_LABELS[top1.position_group] || top1.position_group}
              {top1.age ? ` · ${top1.age} ans` : ""}
            </div>
            <div className="flex gap-4 items-center mb-8 pb-8 border-b" style={{ borderColor: "var(--color-line)" }}>
              <div>
                <div className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 64, lineHeight: 0.85, color: "var(--color-ink)" }}>
                  {top1.rating}
                </div>
                <div className="font-mono text-xs tracking-wider uppercase mt-1" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace" }}>Note FIFA</div>
              </div>
              <div className="flex-1">
                <TierBadge tier={top1.tier} size="lg" />
                <div className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>{top1.form_trend} Forme</div>
              </div>
            </div>
            <Link href={`/player/${top1.lnr_slug}`}
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase border-b pb-1 self-start"
              style={{ color: "var(--color-terra)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", borderColor: "var(--color-terra)" }}>
              Voir la fiche complète →
            </Link>
          </div>
        </section>
      )}

      {/* Top 5 ranking — magazine grid */}
      <div className="px-6 sm:px-12 pt-12 pb-5 flex items-baseline justify-between border-b" style={{ borderColor: "var(--color-line)" }}>
        <h2 className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 48, fontWeight: 400, lineHeight: 1 }}>
          Le classement, <em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>cette semaine</em>
        </h2>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
          N° 01 — TOP 5
        </span>
      </div>

      {top5.length > 0 && (
        <div className="grid border-b" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "var(--color-line)", borderColor: "var(--color-line)" }}>
          {top5.map((p, i) => (
            <Link key={p.lnr_slug} href={`/player/${p.lnr_slug}`}
              className="flex flex-col gap-3 p-6 transition-colors group"
              style={{ background: "var(--color-paper)", minHeight: 280 }}>
              <div className="font-serif italic" style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontSize: i === 0 ? 110 : 80,
                lineHeight: 0.8,
                color: i === 0 ? "var(--color-forest)" : "var(--color-terra)"
              }}>
                {i + 1}
              </div>
              <div className="mt-auto">
                <div className="font-serif text-2xl mb-1 group-hover:opacity-70 transition-opacity"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: i === 0 ? 24 : 20, lineHeight: 1.05 }}>
                  {p.name}
                </div>
                <div className="font-mono text-xs uppercase tracking-wide mb-3" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
                  {p.team}
                </div>
              </div>
              <div className="flex items-end justify-between pt-3 border-t" style={{ borderColor: "var(--color-line)" }}>
                <span className="font-serif text-2xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28 }}>{p.rating}</span>
                <span className="font-mono text-xs px-2 py-1 rounded-full" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  background: p.form_trend === "↗" ? "var(--color-forest)" : p.form_trend === "↘" ? "var(--color-terra)" : "var(--color-paper-3)",
                  color: p.form_trend !== "→" ? "var(--color-paper)" : "var(--color-ink)"
                }}>{p.form_trend}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modules */}
      <div className="px-6 sm:px-12 pt-12 pb-5 flex items-baseline justify-between border-b" style={{ borderColor: "var(--color-line)" }}>
        <h2 className="font-serif" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 48, fontWeight: 400, lineHeight: 1 }}>
          Explorer <em style={{ fontStyle: "italic", color: "var(--color-forest)" }}>les modules</em>
        </h2>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--color-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
          N° 02 — Navigation
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
        {MODULES.map(({ href, glyph, label, desc, variant }) => {
          const s = MOD_STYLE[variant]
          return (
            <Link key={href} href={href}
              className="flex flex-col justify-between p-7 border-r border-b transition-opacity hover:opacity-80"
              style={{ background: s.bg, color: s.color, borderColor: "var(--color-line)", minHeight: 280 }}>
              <div className="font-serif italic self-end text-right" style={{
                fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic",
                fontSize: 80, lineHeight: 0.85, color: s.glyphColor
              }}>{glyph}</div>
              <div>
                <div className="font-serif text-3xl mb-2" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, lineHeight: 0.95 }}>
                  {label}
                </div>
                <div className="text-sm mb-4" style={{ opacity: 0.7, lineHeight: 1.4 }}>{desc}</div>
                <div className="font-mono text-xs tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
                  VOIR →
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <footer className="flex items-end justify-between px-6 sm:px-12 py-12 border-t" style={{ background: "var(--color-paper-2)", borderColor: "var(--color-line)" }}>
        <div className="font-serif italic" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: 72, lineHeight: 0.85, color: "var(--color-ink)" }}>
          Rugby<br /><span style={{ color: "var(--color-terra)" }}>Analytics.</span>
        </div>
        <div className="font-mono text-xs text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--color-muted)", letterSpacing: "0.1em", lineHeight: 1.7, textTransform: "uppercase" }}>
          Top 14 · Saison 2025/26<br />
          Modèle v4.2 · 6 saisons<br />
          © 2026
        </div>
      </footer>
    </div>
  )
}
