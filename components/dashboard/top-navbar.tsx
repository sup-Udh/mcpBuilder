"use client"

import { createClient } from "@/lib/vector/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useTheme } from "@/lib/theme-context"

interface TopNavbarProps {
  user: any
}

export default function TopNavbar({
  user,
}: TopNavbarProps) {
  const supabase = createClient()
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutStatus, setLogoutStatus] = useState("De-authenticating credentials...")

  useEffect(() => {
    if (!loggingOut) return
    const statuses = [
      "De-authenticating credentials...",
      "Safeguarding cached states...",
      "Disconnecting session...",
      "Session terminated."
    ]
    let current = 0
    const interval = setInterval(() => {
      current++
      if (current < statuses.length) {
        setLogoutStatus(statuses[current])
      }
    }, 450)
    return () => clearInterval(interval)
  }, [loggingOut])

  const avatar =
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatar_url ||
    "https://i.pravatar.cc/150?img=12"

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User"

  const handleLogout = async () => {
    setLoggingOut(true)
    setTimeout(async () => {
      await supabase.auth.signOut()
      router.push("/login")
    }, 1800)
  }

  return (
    <>
      <header
        className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between px-6 backdrop-blur-md"
        style={{
          background: isDark
            ? 'rgba(15, 17, 21, 0.85)'
            : 'rgba(247, 246, 243, 0.85)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        {/* LEFT */}
        <div>
          <p
            className="font-mono text-[9px] uppercase tracking-[0.25em]"
            style={{ color: 'var(--text-muted)' }}
          >
            MCP CONTROL PLANE
          </p>
          <h2
            className="mt-0.5 text-base font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome, {name}
          </h2>
        </div>

        {/* RIGHT */}
        <div className="ml-6 flex items-center gap-4">
          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 hover:bg-[var(--bg-elevated-hover)]"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-secondary)',
            }}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* USER INFO */}
          <div className="hidden text-right md:block">
            <p
              className="text-xs font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {name}
            </p>
            <p
              className="font-mono text-[9px]"
              style={{ color: 'var(--text-muted)' }}
            >
              {user?.email}
            </p>
          </div>

          {/* AVATAR */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-md"
              style={{ background: 'rgba(194, 168, 120, 0.2)' }}
            />
            <img
              src={avatar}
              alt="profile"
              referrerPolicy="no-referrer"
              className="relative h-9 w-9 rounded-full object-cover"
              style={{ border: '1px solid var(--border-primary)' }}
            />
          </div>

          {/* LOGOUT */}
          <button
            disabled={loggingOut}
            onClick={handleLogout}
            className="group relative overflow-hidden rounded-xl border border-[var(--status-error)]/20 bg-[var(--status-error)]/10 px-4 py-2 text-xs font-medium text-[var(--status-error)] transition-all duration-200 hover:scale-[1.02] hover:bg-[var(--status-error)]/20 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                power_settings_new
              </span>
              Logout
            </span>
          </button>
        </div>
      </header>

      {/* ===================================== */}
      {/* LOGOUT OVERLAY                        */}
      {/* ===================================== */}
      {loggingOut && (
        <div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden backdrop-blur-2xl transition-all duration-700 animate-fade-in"
          style={{ 
            background: isDark ? 'rgba(8, 5, 15, 0.95)' : 'rgba(250, 249, 251, 0.96)',
          }}
        >
          {/* Layer 1: Fine-mesh structure grid */}
          <div 
            className="absolute inset-0 bg-[size:32px_32px] opacity-40 pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(var(--border-primary) 1px, transparent 1px), linear-gradient(90deg, var(--border-primary) 1px, transparent 1px)'
            }}
          />

          {/* Glowing accents matching current themes */}
          <div className="pointer-events-none absolute h-[400px] w-[400px] rounded-full blur-[120px] opacity-20" style={{ background: 'var(--accent-primary)', top: '10%', left: '15%' }} />
          <div className="pointer-events-none absolute h-[450px] w-[450px] rounded-full blur-[140px] opacity-20" style={{ background: 'var(--accent-highlight)', bottom: '5%', right: '15%' }} />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            
            {/* Elegant thin loader circle */}
            <div className="relative mb-12 flex h-14 w-14 items-center justify-center">
              {/* Spinning Accent Arc */}
              <svg className="absolute h-full w-full animate-spin" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="var(--border-primary)"
                  strokeWidth="1"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="1.5"
                  strokeDasharray="88"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                />
              </svg>
              <span className="material-symbols-outlined text-[18px] text-[var(--accent-primary)] animate-pulse">
                lock
              </span>
            </div>

            {/* LABEL */}
            <p 
              className="font-mono text-[10px] uppercase tracking-[0.4em] font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Signout Sequence
            </p>

            {/* TITLE */}
            <h1
              className="mt-4 text-center text-3xl font-extrabold tracking-tight sm:text-4xl"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Disconnecting from Control Plane
            </h1>

            {/* STATUS CONTAINER */}
            <div 
              className="mt-8 flex items-center justify-center gap-3 rounded-full border px-6 py-2.5 backdrop-blur-md shadow-sm"
              style={{ 
                background: 'var(--bg-secondary)', 
                borderColor: 'var(--border-primary)',
              }}
            >
              {/* Accent indicator blinking soft */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]"></span>
              </span>
              
              <span 
                className="font-mono text-xs font-medium tracking-wide transition-all duration-300 min-w-[240px] text-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                {logoutStatus}
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  )
}