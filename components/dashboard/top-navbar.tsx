"use client"

import { createClient } from "@/lib/vector/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'var(--bg-primary)' }}
        >
          {/* GRID */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundSize: "40px 40px",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            }}
          />

          {/* GLOWS */}
          <div className="absolute h-[500px] w-[500px] rounded-full bg-[var(--status-error)]/5 blur-[140px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[140px]" style={{ background: 'var(--gradient-glow-1)' }} />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col items-center">
            {/* SPINNER */}
            <div className="relative mb-8">
              <div className="absolute inset-0 animate-ping rounded-full bg-[var(--status-error)]/10 blur-xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[var(--status-error)]/20 bg-[var(--status-error)]/5 backdrop-blur-xl">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--status-error)] border-t-transparent" />
              </div>
            </div>

            {/* LABEL */}
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--status-error)]">
              TERMINATING SESSION
            </p>

            {/* TITLE */}
            <h1
              className="mt-4 text-center text-4xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Shutting Down
              <span className="text-[var(--status-error)]">
                {" "}Control Plane
              </span>
            </h1>

            {/* SUBTEXT */}
            <p
              className="mt-4 max-w-xl text-center text-sm leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Revoking active authentication credentials, clearing caches, and closing transport sockets.
            </p>

            {/* TERMINAL */}
            <div
              className="mt-10 w-[450px] rounded-2xl p-6 shadow-xl backdrop-blur-xl"
              style={{
                background: 'rgba(0,0,0,0.15)',
                border: '1px solid var(--border-primary)',
              }}
            >
              {/* TOP BAR */}
              <div className="mb-4 flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--status-error)]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--status-warning)]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[var(--status-success)]" />
                <span
                  className="ml-2 font-mono text-[9px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  runtime-shutdown.log
                </span>
              </div>

              {/* LOGS */}
              <div
                className="space-y-2.5 font-mono text-[11px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <p className="animate-pulse">&gt; Closing active vector channel...</p>
                <p className="animate-pulse delay-75">&gt; Revoking user token keys...</p>
                <p className="animate-pulse delay-150">&gt; Closing Worker worker-threads...</p>
                <p className="animate-pulse delay-300 text-[var(--status-error)]">&gt; Terminated session successfully.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}