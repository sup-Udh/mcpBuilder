"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext =
  createContext<ThemeContextType>({
    theme: "dark",
    toggleTheme: () => {},
    isDark: true,
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

  const [mounted, setMounted] =
    useState(false)

  // Read from localStorage on mount
  useEffect(() => {
    const stored =
      localStorage.getItem("mcp-theme") as Theme | null

    if (stored) {
      setTheme(stored)
    } else if (
      window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches
    ) {
      setTheme("light")
    }

    setMounted(true)
  }, [])

  // Sync to DOM and localStorage
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

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "dark" ? "light" : "dark"
    )
  }

  const isDark = theme === "dark"

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
