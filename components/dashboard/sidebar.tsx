"use client"

import PageLoader from "../PageLoader"
import { useRouter } from "next/navigation"
import { useState } from "react"
export default function Sidebar() {

   const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleNavigate = () => {
    if (loading) return

    setLoading(true)

    document.body.style.overflow = "hidden"

    setTimeout(() => {
      router.push("/dashboard/mcp-servers")
    }, 650)
  }



  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#0A0A0B] px-4 py-6">

      {/* LOGO */}
      <div className="mb-10 flex items-center gap-3 px-2">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]">
          <span className="material-symbols-outlined text-white">
            dns
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold">
            MCP Builder
          </h1>

          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            Infrastructure Engine
          </p>
        </div>

      </div>

      {/* NAV */}
      <nav className="space-y-2">

        <a className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-blue-400">
          <span className="material-symbols-outlined">
            dashboard
          </span>

          Dashboard
        </a>
        

        <a onClick={handleNavigate} className="  cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition hover:bg-white/[0.03] hover:text-white">
          <span className="material-symbols-outlined">
            dns
          </span>

          MCP Servers
        </a>

        <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition hover:bg-white/[0.03] hover:text-white">
          <span className="material-symbols-outlined">
            analytics
          </span>

          Status
        </a>

        <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition hover:bg-white/[0.03] hover:text-white">
          <span className="material-symbols-outlined">
            settings
          </span>

          Settings
        </a>

      </nav>


    </aside>
  )
}