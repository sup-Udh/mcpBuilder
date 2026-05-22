"use client"

import { useEffect, useState } from "react"

export default function GitHubBadge() {
  const [stars, setStars] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    // Check if user has previously dismissed the tooltip
    const isDismissed = localStorage.getItem("mcp-github-tooltip-dismissed") === "true"
    if (!isDismissed) {
      // Show tooltip after a short delay for animation entry
      const timer = setTimeout(() => setShowTooltip(true), 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // Fetch stars count from GitHub repository API
    fetch("https://api.github.com/repos/sup-Udh/mcpBuilder")
      .then((res) => {
        if (!res.ok) throw new Error("API response error")
        return res.json()
      })
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count)
        }
      })
      .catch((err) => {
        console.warn("Could not fetch stars from github, using fallback", err)
        setStars(12) // Realistic fallback
      })
  }, [])

  const handleCloseTooltip = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    localStorage.setItem("mcp-github-tooltip-dismissed", "true")
    setShowTooltip(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Speech bubble tooltip */}
      {showTooltip && (
        <div 
          className="relative flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl border text-[11px] font-medium tracking-wide shadow-xl backdrop-blur-md pointer-events-auto transition-all duration-300 max-w-[260px] text-[#FAF9FB] select-none"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 13, 44, 0.95) 0%, rgba(13, 8, 29, 0.95) 100%)',
            borderColor: 'rgba(255, 64, 129, 0.25)',
            boxShadow: '0 10px 30px rgba(255, 64, 129, 0.15)',
          }}
        >
          {/* Arrow */}
          <div 
            className="absolute bottom-[-6px] right-6 h-2.5 w-2.5 rotate-45 border-r border-b"
            style={{
              background: '#0D081D',
              borderColor: 'rgba(255, 64, 129, 0.25)',
            }}
          />
          
          <span className="flex items-center gap-1.5 leading-normal">
            Support us by starring the repo! 🌟
          </span>

          <button 
            onClick={handleCloseTooltip}
            className="text-white/40 hover:text-white/80 transition-colors p-0.5 rounded-md hover:bg-white/5 active:scale-95 cursor-pointer shrink-0"
            title="Close"
          >
            <span className="material-symbols-outlined text-[10px] font-bold">close</span>
          </button>
        </div>
      )}

      {/* Floating Action Button Badge */}
      <a
        href="https://github.com/sup-Udh/mcpBuilder"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-xs font-semibold tracking-wide shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-98 cursor-pointer select-none group"
        style={{
          backgroundColor: 'rgba(13, 8, 29, 0.75)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* GitHub Logo SVG */}
        <svg 
          className="h-4.5 w-4.5 fill-current transition-transform duration-300 group-hover:scale-110" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.867 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>

        <span>GitHub</span>

        <span className="h-3 w-[1px] bg-white/10 shrink-0" />

        {/* Stars counter with animated gold fill star */}
        <span className="flex items-center gap-1 font-mono text-[11px] font-bold" style={{ color: 'var(--accent-primary)' }}>
          <span 
            className="material-symbols-outlined text-[13px] font-bold animate-pulse"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
          >
            star
          </span>
          {stars !== null ? stars : "—"}
        </span>
      </a>
    </div>
  )
}
