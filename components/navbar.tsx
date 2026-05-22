"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PageLoader from "./PageLoader"
import Link from "next/link"
import { useTheme } from "@/lib/theme-context"

export default function Navbar() {
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll position to adjust navbar backdrop intensity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavigate = () => {
    if (loading) return
    setLoading(true)
    // navigate after a short delay to allow loader animation
    setTimeout(() => {
      router.push("/login")
    }, 1200)
  }

  // keep body overflow consistent while loader is active
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [loading])

  return (
    <>
      {/* SIMPLE PAGE LOADER */}
      {loading && <PageLoader />}

      <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        <nav
          className="flex h-14 w-full max-w-5xl items-center justify-between rounded-full border px-6 transition-all duration-500 pointer-events-auto"
          style={{
            borderColor: 'var(--border-primary)',
            background: scrolled
              ? (isDark ? 'rgba(6, 3, 12, 0.7)' : 'rgba(255, 255, 255, 0.75)')
              : (isDark ? 'rgba(3, 0, 8, 0.4)' : 'rgba(255, 255, 255, 0.45)'),
            backdropFilter: 'blur(20px)',
            boxShadow: scrolled ? (isDark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 12px 40px rgba(21,14,34,0.06)') : 'none',
          }}
        >
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center gap-10">
            <Link href="/" className="group flex items-center gap-3 cursor-pointer">
              {/* Premium abstract dynamic logo */}
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-tr from-[#FF6B35] via-[#FF4081] to-[#7C4DFF] p-[1.5px] transition-all duration-300 group-hover:scale-105">
                <div 
                  className="h-full w-full rounded-[6px] flex items-center justify-center"
                  style={{ background: 'var(--bg-primary)' }}
                >
                  <span className="material-symbols-outlined text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4081]">
                    polymer
                  </span>
                </div>
              </div>
              <span 
                className="text-lg font-bold tracking-tight transition-all duration-300"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                MCP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4081] to-[#FF6B35]">Builder</span>
              </span>
            </Link>

            {/* Navigation links with premium hover underline indicator */}
            <div className="hidden items-center gap-8 md:flex">
              <Link
                className="relative text-sm text-[#A69EAF] font-medium transition-colors hover:text-[var(--text-primary)] group"
                href="/#features"
              >
                Features
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF6B35] to-[#FF4081] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                className="relative text-sm text-[#A69EAF] font-medium transition-colors hover:text-[var(--text-primary)] group"
                href="/#pipeline"
              >
                Infrastructure
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF6B35] to-[#FF4081] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                className="relative text-sm text-[#A69EAF] font-medium transition-colors hover:text-[var(--text-primary)] group"
                href="/#ecosystem"
              >
                Ecosystem
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF6B35] to-[#FF4081] transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Call to Action & Theme Toggle */}
          <div className="flex items-center gap-4">
            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[var(--bg-card-hover)] cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)',
              }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDark ? "light_mode" : "dark_mode"}
              </span>
            </button>

            <button
              onClick={handleNavigate}
              disabled={loading}
              className="relative cursor-pointer overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-[0.98] disabled:opacity-50 group animate-pulse-soft"
              style={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF4081 100%)',
                boxShadow: '0 4px 15px rgba(255, 64, 129, 0.25)',
              }}
            >
              {/* Inner highlight transition */}
              <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10 flex items-center gap-1.5">
                {loading ? "Loading..." : "Get Started"}
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </span>
            </button>
          </div>
        </nav>
      </div>
    </>
  )

}