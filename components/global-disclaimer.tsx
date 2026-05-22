"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/lib/theme-context"

export default function GlobalDisclaimer() {
  const { isDark } = useTheme()
  const [dismissed, setDismissed] = useState(true) // start true to prevent SSR mismatch

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("mcp-disclaimer-dismissed") === "true"
    setDismissed(isDismissed)
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem("mcp-disclaimer-dismissed", "true")
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="fixed top-20 left-0 right-0 z-[99] flex flex-col items-center gap-2 px-4 pointer-events-none">
      <div
        className="flex items-center gap-2.5 px-4 py-2 rounded-full text-[10px] font-mono tracking-wider uppercase border shadow-md backdrop-blur-md pointer-events-auto transition-all duration-300 group"
        style={{
          backgroundColor: isDark ? 'rgba(15, 17, 21, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-secondary)'
        }}
      >
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B35]"></span>
        </span>
        
        <span style={{ color: 'var(--text-primary)' }} className="font-bold shrink-0">
          v1.0 (BETA)
        </span>
        
        <span style={{ color: 'var(--border-primary)' }} className="shrink-0">|</span>
        
        <span className="normal-case font-medium line-clamp-1 max-w-[280px] sm:max-w-md md:max-w-none text-left">
          Under active development — if a feature doesn't work, it is still being implemented.
        </span>

        <button 
          onClick={handleDismiss}
          className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ color: 'var(--text-muted)' }}
          title="Dismiss banner"
        >
          <span className="material-symbols-outlined text-[12px] font-bold">close</span>
        </button>
      </div>
    </div>
  )
}
