"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

type Theme = "dark" | "light"

// 30 developer-centric color palettes for rotation
export const PALETTES = [
  { name: "Emerald Aurora", primary: "#10B981", secondary: "#059669", highlight: "#34D399" },
  { name: "Cyber Indigo", primary: "#6366F1", secondary: "#4F46E5", highlight: "#818CF8" },
  { name: "Sunset Rose", primary: "#EC4899", secondary: "#D946EF", highlight: "#F472B6" },
  { name: "Amber Gold", primary: "#F59E0B", secondary: "#D97706", highlight: "#FBBF24" },
  { name: "Teal Breeze", primary: "#14B8A6", secondary: "#0D9488", highlight: "#2DD4BF" },
  { name: "Electric Blue", primary: "#3B82F6", secondary: "#2563EB", highlight: "#60A5FA" },
  { name: "Crimson Rust", primary: "#EF4444", secondary: "#DC2626", highlight: "#F87171" },
  { name: "Violet Fusion", primary: "#8B5CF6", secondary: "#7C3AED", highlight: "#A78BFA" },
  { name: "Sky Cyan", primary: "#06B6D4", secondary: "#0891B2", highlight: "#22D3EE" },
  { name: "Tangerine Glow", primary: "#F97316", secondary: "#EA580C", highlight: "#FB923C" },
  { name: "Fuchsia Spark", primary: "#D946EF", secondary: "#C084FC", highlight: "#F472B6" },
  { name: "Forest Mint", primary: "#22C55E", secondary: "#16A34A", highlight: "#4ADE80" },
  { name: "Plum Orchid", primary: "#A855F7", secondary: "#8B5CF6", highlight: "#C084FC" },
  { name: "Neon Lime", primary: "#84CC16", secondary: "#65A30D", highlight: "#A3E635" },
  { name: "Coral Reef", primary: "#FF7F50", secondary: "#FF6B6B", highlight: "#FFA07A" },
  { name: "Slate Cyber", primary: "#64748B", secondary: "#475569", highlight: "#94A3B8" },
  { name: "Sage Whisper", primary: "#8FBC8F", secondary: "#6B8E23", highlight: "#98FB98" },
  { name: "Deep Ocean", primary: "#1E3A8A", secondary: "#1D4ED8", highlight: "#3B82F6" },
  { name: "Royal Gold", primary: "#FFD700", secondary: "#DAA520", highlight: "#FFDF00" },
  { name: "Rosewood", primary: "#CD5C5C", secondary: "#BC8F8F", highlight: "#E9967A" },
  { name: "Hot Magenta", primary: "#FF007F", secondary: "#FF1493", highlight: "#FF69B4" },
  { name: "Midnight Violet", primary: "#4B0082", secondary: "#8A2BE2", highlight: "#9370DB" },
  { name: "Cadet Blue", primary: "#5F9EA0", secondary: "#4682B4", highlight: "#B0C4DE" },
  { name: "Sienna Earth", primary: "#A0522D", secondary: "#CD853F", highlight: "#E9967A" },
  { name: "Turquoise Wave", primary: "#40E0D0", secondary: "#00CED1", highlight: "#48D1CC" },
  { name: "Lavender Velvet", primary: "#B57EDC", secondary: "#9966CC", highlight: "#E0B0FF" },
  { name: "Bronze Gold", primary: "#CD7F32", secondary: "#B8860B", highlight: "#FFD700" },
  { name: "Ocean Teal", primary: "#30D5C8", secondary: "#20B2AA", highlight: "#40E0D0" },
  { name: "Firebrick", primary: "#B22222", secondary: "#CD5C5C", highlight: "#FF6347" },
  { name: "Sky Cobalt", primary: "#1E90FF", secondary: "#4169E1", highlight: "#00BFFF" }
]

function hexToRgb(hex: string): string {
  const cleaned = hex.replace("#", "")
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
  paletteIndex: number
  rotatePalette: () => void
}

const ThemeContext =
  createContext<ThemeContextType>({
    theme: "dark",
    toggleTheme: () => {},
    isDark: true,
    paletteIndex: 0,
    rotatePalette: () => {},
  })

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] =
    useState<Theme>("dark")

  const [paletteIndex, setPaletteIndex] =
    useState<number>(0)

  const [mounted, setMounted] =
    useState(false)

  // Read from localStorage on mount
  useEffect(() => {
    const storedTheme =
      localStorage.getItem("mcp-theme") as Theme | null

    if (storedTheme) {
      setTheme(storedTheme)
    } else if (
      window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches
    ) {
      setTheme("light")
    }

    const storedPalette =
      localStorage.getItem("mcp-dashboard-palette")
    if (storedPalette) {
      const idx = parseInt(storedPalette, 10)
      if (!isNaN(idx) && idx >= 0 && idx < PALETTES.length) {
        setPaletteIndex(idx)
      } else {
        const randomIdx = Math.floor(Math.random() * PALETTES.length)
        localStorage.setItem("mcp-dashboard-palette", String(randomIdx))
        setPaletteIndex(randomIdx)
      }
    } else {
      const randomIdx = Math.floor(Math.random() * PALETTES.length)
      localStorage.setItem("mcp-dashboard-palette", String(randomIdx))
      setPaletteIndex(randomIdx)
    }

    setMounted(true)
  }, [])

  // Sync theme to DOM and localStorage
  useEffect(() => {
    if (!mounted) return

    document.documentElement.setAttribute(
      "data-theme",
      theme
    )

    localStorage.setItem(
      "mcp-theme",
      theme
    )
  }, [theme, mounted])

  // Sync palette CSS variables to document root
  useEffect(() => {
    if (!mounted) return

    const palette = PALETTES[paletteIndex]
    const root = document.documentElement

    const primaryRgb = hexToRgb(palette.primary)
    const secondaryRgb = hexToRgb(palette.secondary)
    const highlightRgb = hexToRgb(palette.highlight)

    root.style.setProperty("--accent-primary", palette.primary)
    root.style.setProperty("--accent-secondary", palette.secondary)
    root.style.setProperty("--accent-highlight", palette.highlight)
    root.style.setProperty("--accent-rgb", primaryRgb)
    root.style.setProperty("--highlight-rgb", highlightRgb)

    // Derived borders & gradients
    root.style.setProperty("--border-hover", `rgba(${primaryRgb}, 0.3)`)
    root.style.setProperty("--border-accent", `rgba(${primaryRgb}, 0.4)`)
    root.style.setProperty("--gradient-primary", `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`)
    root.style.setProperty("--gradient-subtle", `linear-gradient(135deg, rgba(${primaryRgb}, 0.1), rgba(${secondaryRgb}, 0.05))`)
    root.style.setProperty("--gradient-card", `linear-gradient(135deg, rgba(${primaryRgb}, 0.04), rgba(${highlightRgb}, 0.03))`)
    
    root.style.setProperty("--gradient-glow-1", `rgba(${primaryRgb}, 0.08)`)
    root.style.setProperty("--gradient-glow-2", `rgba(${secondaryRgb}, 0.06)`)
    root.style.setProperty("--gradient-glow-3", `rgba(${highlightRgb}, 0.05)`)

    root.style.setProperty("--scrollbar-thumb", `rgba(${primaryRgb}, 0.16)`)
    root.style.setProperty("--scrollbar-thumb-hover", `rgba(${primaryRgb}, 0.34)`)
    root.style.setProperty("--scrollbar-thumb-active", `rgba(${primaryRgb}, 0.48)`)
    root.style.setProperty("--scrollbar-shadow-hover", `rgba(${primaryRgb}, 0.16)`)
  }, [paletteIndex, mounted])

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "dark" ? "light" : "dark"
    )
  }

  const rotatePalette = () => {
    setPaletteIndex((prev) => {
      let next = prev
      // Ensure we get a different palette than the current one
      while (next === prev && PALETTES.length > 1) {
        next = Math.floor(Math.random() * PALETTES.length)
      }
      localStorage.setItem("mcp-dashboard-palette", String(next))
      return next
    })
  }

  const isDark = theme === "dark"

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark, paletteIndex, rotatePalette }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
