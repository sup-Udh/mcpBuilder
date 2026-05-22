"use client"

import PageLoader from "../PageLoader"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "@/lib/theme-context"
import Logo from "../logo"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { isDark } = useTheme()

  const [loading, setLoading] = useState(false)

  const handleNavigate = (path: string) => {
    if (loading || pathname === path) return
    setLoading(true)
    setTimeout(() => {
      router.push(path)
    }, 650)
  }

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [loading])

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  // Sidebar link styles conforming to the Vercel/Linear-like minimal design
  const activeClass = "border-l-2 border-[var(--accent-primary)] bg-[var(--bg-elevated)] text-[var(--text-primary)] pl-3.5 pr-4 py-2.5"
  const inactiveClass = "border-l-2 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated-hover)] hover:text-[var(--text-primary)] pl-3.5 pr-4 py-2.5"

  return (
    <>
      {loading && <PageLoader />}

      <aside
        className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col px-4 py-6"
        style={{
          background: 'var(--bg-secondary)',
          borderRight: `1px solid var(--border-primary)`,
        }}
      >
        {/* LOGO */}
        <div className="mb-10 flex items-center gap-3 px-2">
          {/* Deep green + champagne accent logo */}
          <Logo size={38} />

          <div>
            <h1
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              MCP Builder
            </h1>
            <p
              className="font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--text-muted)' }}
            >
              Infrastructure Engine
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => handleNavigate("/dashboard")}
            className={`flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive("/dashboard") &&
              !isActive("/dashboard/mcp-servers") &&
              !isActive("/dashboard/settings")
                ? activeClass
                : inactiveClass
            }`}
          >
            <span className="material-symbols-outlined shrink-0 text-[18px]">
              dashboard
            </span>
            <span className="truncate">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigate("/dashboard/mcp-servers")}
            className={`flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive("/dashboard/mcp-servers")
                ? activeClass
                : inactiveClass
            }`}
          >
            <span className="material-symbols-outlined shrink-0 text-[18px]">
              dns
            </span>
            <span className="truncate">MCP Servers</span>
          </button>

          <button
            onClick={() => handleNavigate("/dashboard/settings")}
            className={`flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive("/dashboard/settings")
                ? activeClass
                : inactiveClass
            }`}
          >
            <span className="material-symbols-outlined shrink-0 text-[18px]">
              settings
            </span>
            <span className="truncate">Settings</span>
          </button>
        </nav>

        {/* FOOTER */}
        <div
          className="rounded-xl p-4"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span
              className="font-mono text-[9px] uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Runtime Status
            </span>
            <span
              className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider"
              style={{ color: 'var(--status-success)' }}
            >
              <div
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ background: 'var(--status-success)' }}
              />
              Healthy
            </span>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full"
            style={{ background: 'var(--bg-primary)' }}
          >
            <div
              className="h-full w-[72%] rounded-full"
              style={{ background: 'var(--gradient-primary)' }}
            />
          </div>
        </div>
      </aside>
    </>
  )
}