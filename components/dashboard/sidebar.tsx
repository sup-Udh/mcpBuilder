"use client"

import PageLoader from "../PageLoader"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export default function Sidebar() {

  const router = useRouter()
  const pathname = usePathname()

  const [loading, setLoading] = useState(false)

  const handleNavigate = (path: string) => {

    if (loading || pathname === path) return

    setLoading(true)

    document.body.style.overflow = "hidden"

    setTimeout(() => {
      router.push(path)
    }, 650)
  }

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  const activeClass =
    "border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.08)]"

  const inactiveClass =
    "text-white/60 hover:bg-white/[0.03] hover:text-white"

  return (
    <>

      {loading && <PageLoader />}

      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#0A0A0B] px-4 py-6">

        {/* LOGO */}
        <div className="mb-10 flex items-center gap-3 px-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6] shadow-[0_0_25px_rgba(59,130,246,0.25)]">

            <span className="material-symbols-outlined text-white">
              dns
            </span>

          </div>

          <div>

            <h1 className="text-xl font-bold text-white">
              MCP Builder
            </h1>

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Infrastructure Engine
            </p>

          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">

          <button
            onClick={() => handleNavigate("/dashboard")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              isActive("/dashboard") &&
              !isActive("/dashboard/mcp-servers")
                ? activeClass
                : inactiveClass
            }`}
          >

            <span className="material-symbols-outlined shrink-0">
              dashboard
            </span>

            <span className="truncate">
              Dashboard
            </span>

          </button>

          <button
            onClick={() => handleNavigate("/dashboard/mcp-servers")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              isActive("/dashboard/mcp-servers")
                ? activeClass
                : inactiveClass
            }`}
          >

            <span className="material-symbols-outlined shrink-0">
              dns
            </span>

            <span className="truncate">
              MCP Servers
            </span>

          </button>

          <button
            onClick={() => handleNavigate("/dashboard/status")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              isActive("/dashboard/status")
                ? activeClass
                : inactiveClass
            }`}
          >

            <span className="material-symbols-outlined shrink-0">
              analytics
            </span>

            <span className="truncate">
              Status
            </span>

          </button>

          <button
            onClick={() => handleNavigate("/dashboard/settings")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
              isActive("/dashboard/settings")
                ? activeClass
                : inactiveClass
            }`}
          >

            <span className="material-symbols-outlined shrink-0">
              settings
            </span>

            <span className="truncate">
              Settings
            </span>

          </button>

        </nav>

        {/* FOOTER */}
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">

          <div className="mb-3 flex items-center justify-between">

            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              Runtime Status
            </span>

            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-green-300">

              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              Healthy

            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/5">

            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 shadow-[0_0_20px_rgba(59,130,246,0.25)]" />

          </div>

        </div>

      </aside>

    </>
  )
}