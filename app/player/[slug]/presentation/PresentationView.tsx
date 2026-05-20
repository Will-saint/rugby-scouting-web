"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { PlayerDetail } from "@/lib/types"
import { PlayerRadar } from "@/components/PlayerRadar"
import { POSITION_LABELS, TIER_COLORS } from "@/lib/constants"

interface Props { player: PlayerDetail; season: string; slug: string }

const TIER_LABEL: Record<string, string> = {
  LEGENDAIRE: "LÉGENDAIRE", OR: "OR", ARGENT: "ARGENT", BRONZE: "BRONZE", STANDARD: "STANDARD",
}

export function PresentationView({ player, season, slug }: Props) {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false)
      if (e.key === "f" || e.key === "F") setFullscreen(v => !v)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const accentColor = TIER_COLORS[player.tier] || "#F97316"

  const axes = {
    axis_att: player.axis_att, axis_def: player.axis_def,
    axis_ctrl: player.axis_ctrl, axis_kick: player.axis_kick,
    axis_pow: player.axis_pow, axis_gabarit: player.axis_gabarit,
    axis_disc: player.axis_disc,
  }

  const stats = [
    { label: "Plaquages / 80", value: player.tackles_per80 },
    { label: "Offloads / 80",  value: player.offloads_per80 },
    { label: "Franchiss. / 80", value: player.line_breaks_per80 },
    { label: "Turnovers / 80", value: player.turnovers_won_per80 },
    { label: "Essais / 80",    value: player.tries_per80 },
    { label: "Pts pied / 80",  value: player.kick_points_per80 },
  ].filter(s => s.value != null && s.value > 0)

  return (
    <>
      {/* Fixed overlay covering navbar/footer */}
      <div
        className="fixed inset-0 z-[200] overflow-hidden flex flex-col"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2210 50%, #1a0a0a 100%)" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link
            href={`/player/${slug}?season=${season}`}
            className="text-xs font-mono tracking-widest transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}
          >
            ← RETOUR
          </Link>
          <span className="text-xs font-mono tracking-widest" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace" }}>
            TOP 14 · {season} · MODE PRÉSENTATION
          </span>
          <button
            onClick={() => setFullscreen(v => !v)}
            className="text-xs font-mono tracking-widest transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em", background: "none", border: "none", cursor: "pointer" }}
          >
            {fullscreen ? "RÉDUIRE [F]" : "PLEIN ÉCRAN [F]"}
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: "1fr 1.6fr" }}>

          {/* LEFT — Photo */}
          <div className="relative overflow-hidden" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            {player.photo_url ? (
              <Image
                src={player.photo_url}
                alt={player.name ?? ""}
                fill
                className="object-cover object-top"
                unoptimized
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ fontSize: 120, opacity: 0.1 }}>🏉</div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, #0a1628 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,22,40,0.85) 0%, transparent 40%)" }} />

            {/* Team + season bottom left */}
            <div className="absolute bottom-6 left-6">
              <p className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
                {player.team}
              </p>
            </div>
          </div>

          {/* RIGHT — Data */}
          <div className="overflow-y-auto px-10 py-8 flex flex-col gap-7">

            {/* Name + tier */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: accentColor, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.2em" }}>
                  {POSITION_LABELS[player.position_group] || player.position_group}
                </span>
                {player.nationality && (
                  <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>· {player.nationality}</span>
                )}
              </div>
              <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 400, lineHeight: 1, color: "#ffffff", letterSpacing: "-0.02em" }}>
                {player.name}
              </h1>
              {/* Award badges */}
              {player.badges && player.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {player.badges.map((b, i) => (
                    <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                      style={{ borderColor: b.color, color: b.color, background: `${b.color}18` }}>
                      {b.short}{b.year ? ` ${b.year}` : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rating + tier */}
            <div className="flex items-end gap-6">
              <div>
                <p className="font-mono text-xs tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
                  NOTE GLOBALE
                </p>
                <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(64px, 8vw, 110px)", fontWeight: 400, lineHeight: 1, color: accentColor }}>
                  {player.rating}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: "rgba(255,255,255,0.2)", marginLeft: 6 }}>/99</span>
              </div>
              <div className="mb-3">
                <span className="font-mono font-bold text-sm px-3 py-1.5 rounded-lg" style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40`, letterSpacing: "0.1em" }}>
                  {TIER_LABEL[player.tier] || player.tier}
                </span>
                {player.rating_intl && (
                  <div className="mt-2">
                    <span className="font-mono text-xs px-2.5 py-1 rounded" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}>
                      {player.team_intl} · {player.matches_intl} caps · {player.rating_intl}/99
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Radar */}
            <div>
              <p className="font-mono text-xs tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
                PROFIL RADAR
              </p>
              <PlayerRadar data={axes} playerName={player.name} height={220} />
            </div>

            {/* Stats grid */}
            {stats.length > 0 && (
              <div>
                <p className="font-mono text-xs tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
                  STATS CLÉS PAR 80 MIN
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {stats.map(({ label, value }) => (
                    <div key={label} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
                      <div className="font-semibold text-white" style={{ fontSize: 22, fontFamily: "'Instrument Serif', Georgia, serif" }}>
                        {value?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Physical + form */}
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.08em" }}>
              {player.age && <span>{player.age} ANS</span>}
              {player.height_cm && <span>{player.height_cm} CM</span>}
              {player.weight_kg && <span>{player.weight_kg} KG</span>}
              {player.form_score != null && <span>FORME {Math.round(player.form_score)}/100 {player.form_trend}</span>}
              <span>{player.confidence_badge?.toUpperCase()} CONFIANCE</span>
            </div>
          </div>
        </div>

        {/* Fullscreen overlay */}
        {fullscreen && (
          <div className="absolute inset-0 z-10 flex flex-col" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2210 50%, #1a0a0a 100%)" }}>
            <div className="flex-1 grid" style={{ gridTemplateColumns: "1fr 1.6fr" }}>
              <div className="relative overflow-hidden">
                {player.photo_url && (
                  <Image src={player.photo_url} alt={player.name ?? ""} fill className="object-cover object-top" unoptimized priority />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, #0a1628 100%)" }} />
              </div>
              <div className="flex flex-col justify-center px-16 py-10 gap-6">
                <p className="font-mono text-xs tracking-[0.2em]" style={{ color: accentColor, fontFamily: "'JetBrains Mono', monospace" }}>
                  {POSITION_LABELS[player.position_group] || player.position_group} · {player.team}
                </p>
                <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(56px, 6vw, 100px)", fontWeight: 400, lineHeight: 1, color: "#fff" }}>
                  {player.name}
                </h1>
                <div className="flex items-end gap-6">
                  <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(80px, 10vw, 140px)", fontWeight: 400, lineHeight: 1, color: accentColor }}>
                    {player.rating}
                  </span>
                  <div className="mb-4 space-y-2">
                    <span className="block font-mono font-bold px-4 py-2 rounded-xl text-lg" style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}>
                      {TIER_LABEL[player.tier] || player.tier}
                    </span>
                    {player.badges?.slice(0, 2).map((b, i) => (
                      <span key={i} className="block text-xs font-semibold px-3 py-1 rounded-full border" style={{ borderColor: b.color, color: b.color }}>
                        {b.short}{b.year ? ` ${b.year}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setFullscreen(false)} className="self-start font-mono text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.2em" }}>
                  [ESC] FERMER
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
