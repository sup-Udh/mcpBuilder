"use client"

import { createClient } from "@/lib/vector/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface TopNavbarProps {
  user: any
}

export default function TopNavbar({
  user,
}: TopNavbarProps) {
  const supabase = createClient()

  const router = useRouter()

  const [loggingOut, setLoggingOut] =
    useState(false)

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

    // cinematic shutdown delay
    setTimeout(async () => {
      await supabase.auth.signOut()

      router.push("/login")
    }, 1800)
  }

  return (
    <>
      <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#020617]/80 px-6 backdrop-blur-xl">

        {/* LEFT */}
        <div>

          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            MCP CONTROL PLANE
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Welcome back, {name}
          </h2>

        </div>

        {/* RIGHT */}
        <div className="ml-6 flex items-center gap-4">

          {/* USER INFO */}
          <div className="hidden text-right md:block">

            <p className="text-sm font-medium text-white">
              {name}
            </p>

            <p className="text-xs text-white/40">
              {user?.email}
            </p>

          </div>

          {/* AVATAR */}
          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl" />

            <img
              src={avatar}
              alt="profile"
              referrerPolicy="no-referrer"
              className="relative h-10 w-10 rounded-full border border-white/10 object-cover"
            />

          </div>

          {/* LOGOUT */}
          <button
            disabled={loggingOut}
            onClick={handleLogout}
            className="group relative overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all duration-300 hover:scale-[1.03] hover:bg-red-500/20 hover:text-red-200 active:scale-[0.98]"
          >

            <div className="absolute inset-0 translate-y-full bg-gradient-to-r from-red-500/20 to-red-400/10 transition-transform duration-300 group-hover:translate-y-0" />

            <span className="relative z-10 flex items-center gap-2">

              <span className="material-symbols-outlined text-[18px]">
                power_settings_new
              </span>

              Logout

            </span>

          </button>

        </div>

      </header>

      {/* ===================================== */}
      {/* LOGOUT OVERLAY */}
      {/* ===================================== */}

      {loggingOut && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[#020617]">

          {/* GRID */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundSize: "40px 40px",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            }}
          />

          {/* RED GLOW */}
          <div className="absolute h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[140px]" />

          {/* BLUE GLOW */}
          <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-col items-center">

            {/* SPINNER */}
            <div className="relative mb-10">

              <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20 blur-2xl" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 backdrop-blur-xl">

                <div className="h-12 w-12 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />

              </div>

            </div>

            {/* LABEL */}
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-red-300">
              TERMINATING SESSION
            </p>

            {/* TITLE */}
            <h1 className="mt-5 text-center text-5xl font-bold tracking-tight text-white">

              Shutting Down
              <span className="bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
                {" "}Control Plane
              </span>

            </h1>

            {/* SUBTEXT */}
            <p className="mt-5 max-w-2xl text-center text-lg leading-relaxed text-white/40">

              Revoking authentication tokens, disconnecting vector runtimes,
              and shutting down active MCP infrastructure.

            </p>

            {/* TERMINAL */}
            <div className="mt-12 w-[500px] rounded-3xl border border-white/10 bg-black/30 p-6 shadow-[0_0_60px_rgba(255,0,0,0.08)] backdrop-blur-xl">

              {/* TOP BAR */}
              <div className="mb-5 flex items-center gap-2 border-b border-white/5 pb-4">

                <div className="h-3 w-3 rounded-full bg-red-500" />

                <div className="h-3 w-3 rounded-full bg-yellow-500" />

                <div className="h-3 w-3 rounded-full bg-green-500" />

                <span className="ml-3 font-mono text-[11px] text-white/30">
                  runtime-shutdown.log
                </span>

              </div>

              {/* LOGS */}
              <div className="space-y-3 font-mono text-xs text-white/50">

                <p className="animate-pulse">
                  &gt; Destroying active session...
                </p>

                <p className="animate-pulse delay-100">
                  &gt; Disconnecting vector runtime...
                </p>

                <p className="animate-pulse delay-200">
                  &gt; Revoking OAuth credentials...
                </p>

                <p className="animate-pulse delay-300">
                  &gt; Closing MCP transport layer...
                </p>

                <p className="animate-pulse delay-500 text-red-300">
                  &gt; Session terminated successfully.
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
    </>
  )
}