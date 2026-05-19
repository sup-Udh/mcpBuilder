"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import TransitionLoader from "./TransitionLoader"

export default function Navbar() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleNavigate = () => {
    if (loading) return

    setLoading(true)

    // lock scrolling
    document.body.style.overflow = "hidden"

    setTimeout(() => {
      router.push("/login")
    }, 1800)
  }

  return (
    <>
      {/* FULL SCREEN TRANSITION */}
      {loading && <TransitionLoader />}

      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* LEFT */}
          <div className="flex items-center gap-10">

            <div className="flex items-center gap-3">

              <div className="h-8 w-8 rounded-lg bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

              <span className="text-xl font-bold tracking-tight text-white">
                MCP Builder
              </span>

            </div>

            <div className="hidden items-center gap-8 md:flex">

              <a
                className="font-semibold text-blue-400"
                href="#"
              >
                Features
              </a>

              <a
                className="text-white/60 transition-colors hover:text-white"
                href="#"
              >
                Docs
              </a>

            </div>

          </div>

          {/* RIGHT */}
          <button
            onClick={handleNavigate}
            disabled={loading}
            className="cursor-pointer rounded-lg bg-blue-500 px-5 py-2 font-semibold text-white transition hover:scale-105 hover:bg-blue-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Initializing..." : "Get Started"}
          </button>

        </div>
      </nav>
    </>
  )
}