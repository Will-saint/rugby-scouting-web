import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google"

const sans = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-sans", weight: ["400","500","700"] })
const serif = Instrument_Serif({ subsets: ["latin"], variable: "--font-serif", weight: "400", style: ["normal","italic"] })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400","500"] })

export const metadata: Metadata = {
  title: "Rugby Analytics — Top 14 Dashboard",
  description: "Analyse des 544 joueurs du Top 14 — notes FIFA, radars, prédicteur de match",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="antialiased bg-paper-texture">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
