"use client"

import Link from "next/link"
import { useState } from "react"
import { createClient } from "../../lib/vector/client"

export default function LoginPage() {
  const supabase = createClient()

  const [loading, setLoading] =
    useState(false)

  const [acceptedTerms, setAcceptedTerms] =
    useState(false)

  const [error, setError] =
    useState("")

  async function signInWithGoogle() {
    if (!acceptedTerms) {
      setError(
        "You must accept the Terms and Privacy Policy before continuing."
      )

      return
    }

    setError("")

    setLoading(true)

    await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo:
          "http://localhost:3000/auth/callback",
      },
    })
  }

  return (
    <main className="min-h-screen bg-[#131314] text-[#E5E2E3] md:flex">

      {/* LEFT SIDE */}
      <section className="relative hidden w-[42%] border-r border-white/[0.06] bg-[#131314] p-8 lg:flex lg:flex-col">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid opacity-40" />

        {/* GLOW BACKGROUNDS */}
        <div className="animate-pulse-soft absolute left-[-15%] top-[-10%] h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="animate-pulse-soft absolute right-[-15%] h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[120px]" />

        {/* HEADER */}
        <div className="relative z-20 mb-10 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6] shadow-[0_0_30px_rgba(59,130,246,0.35)]">
              <span className="text-lg font-bold text-white">
                M
              </span>
            </div>

            <div>

              <h3 className="text-[20px] font-semibold tracking-tight">
                Control Plane
              </h3>

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ADC6FF]">
                SYSTEM OPERATIONAL V2.4.0
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">

            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

            <span className="font-mono text-[10px] uppercase tracking-widest text-[#C2C6D6]">
              NODE_01 ONLINE
            </span>

          </div>

        </div>

        {/* DASHBOARD */}
        <div className="relative z-10 grid flex-1 grid-cols-12 grid-rows-12 gap-4">

          {/* TERMINAL */}
          <div className="col-span-8 row-span-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-2xl backdrop-blur-xl">

            {/* TOP BAR */}
            <div className="flex items-center justify-between border-b border-white/[0.04] bg-black/20 px-4 py-2">

              <div className="flex gap-1.5">

                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />

              </div>

              <span className="font-mono text-[11px] text-[#8C909F]">
                bash — mcp-init.sh
              </span>

            </div>

            {/* TERMINAL BODY */}
            <div className="h-full p-4 font-mono text-[13px]">

              <div className="space-y-1">

                <p className="text-[#60A5FA]">
                  $ npm install @model-context-protocol/sdk
                </p>

                <p className="opacity-60">
                  added 42 packages and audited 43 packages in 2s
                </p>

                <p className="mt-3 text-[#60A5FA]">
                  $ mcp-cli provision --provider claude-3-5
                </p>

                <div className="mt-1 flex items-center gap-1 text-white">

                  <span>
                    Provisioning cloud infrastructure...
                  </span>

                  <span className="animate-blink">
                    |
                  </span>

                </div>

                <div className="animate-terminal-scroll mt-5 space-y-1 opacity-40">

                  <p>&gt; Fetching configuration from remote...</p>
                  <p>&gt; Establishing encrypted tunnel...</p>
                  <p>&gt; Allocating vector shards...</p>
                  <p>&gt; Hot reloading AI environment...</p>
                  <p>&gt; Connecting to Claude Sonnet...</p>
                  <p>&gt; Initializing semantic index...</p>
                  <p>&gt; Indexing data sources...</p>
                  <p>&gt; Setting up WebSocket listeners...</p>

                </div>

              </div>

            </div>

          </div>

          {/* PIPELINE */}
          <div className="relative col-span-4 row-span-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-2xl backdrop-blur-xl">

            <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-[#C2C6D6]">
              Pipeline Flow
            </div>

            <div className="flex h-full flex-col items-center justify-center gap-8">

              {/* SOURCE */}
              <div className="relative z-10 flex h-14 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                  <div className="h-3 w-3 rounded-full bg-[#60A5FA]" />
                </div>

                <div>

                  <p className="font-mono text-[10px] uppercase text-[#C2C6D6]">
                    Source
                  </p>

                  <p className="text-xs font-bold">
                    Vector DB
                  </p>

                </div>

              </div>

              {/* CONNECTION */}
              <div className="relative flex h-20 items-center justify-center">

                <div className="absolute h-full w-[2px] bg-white/10" />

                <div className="animate-pulse absolute h-10 w-[2px] bg-gradient-to-b from-[#3B82F6] to-violet-400" />

              </div>

              {/* PROCESSOR */}
              <div className="animate-node-pulse relative z-10 flex h-16 w-full items-center gap-3 rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 shadow-[0_0_30px_rgba(59,130,246,0.2)]">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.35)]">

                  <div className="h-4 w-4 rounded-full bg-white" />

                </div>

                <div>

                  <p className="font-mono text-[10px] uppercase text-[#ADC6FF]">
                    Processor
                  </p>

                  <p className="text-xs font-bold">
                    Claude 3.5 Sonnet
                  </p>

                </div>

              </div>

              {/* CONNECTION */}
              <div className="relative flex h-20 items-center justify-center">

                <div className="absolute h-full w-[2px] bg-white/10" />

                <div className="animate-pulse absolute h-10 w-[2px] bg-gradient-to-b from-violet-400 to-transparent" />

              </div>

              {/* OUTPUT */}
              <div className="relative z-10 flex h-14 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                  <div className="h-3 w-3 rounded-full bg-violet-400" />
                </div>

                <div>

                  <p className="font-mono text-[10px] uppercase text-[#C2C6D6]">
                    Output
                  </p>

                  <p className="text-xs font-bold">
                    localhost:8080
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* METRICS */}
          <div className="animate-float col-span-5 row-span-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-2xl backdrop-blur-xl">

            <div className="flex items-start justify-between">

              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C2C6D6]">
                Latency / Throughput
              </span>

              <span className="text-xs font-bold text-[#60A5FA]">
                14ms
              </span>

            </div>

            <div className="mt-4 h-16 w-full">

              <svg
                viewBox="0 0 200 60"
                className="h-full w-full"
              >

                <path
                  d="M0 45 Q 20 40, 40 50 T 80 30 T 120 45 T 160 20 L 200 35"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  opacity="0.9"
                />

              </svg>

            </div>

            <div className="mt-4 flex gap-5">

              <div>

                <p className="font-mono text-[9px] uppercase text-[#C2C6D6]">
                  CPU
                </p>

                <p className="text-xs font-bold">
                  12%
                </p>

              </div>

              <div>

                <p className="font-mono text-[9px] uppercase text-[#C2C6D6]">
                  RAM
                </p>

                <p className="text-xs font-bold">
                  4.2GB
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="relative z-20 mt-12">

          <h2 className="max-w-sm text-[32px] font-semibold leading-[1.2] tracking-[-0.02em]">
            Build AI-ready MCP servers in minutes.
          </h2>

          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[#C2C6D6]">
            Enterprise-grade infrastructure for the Model Context Protocol. Deploy production-ready connectors to Claude in seconds.
          </p>

        </div>

      </section>

      {/* RIGHT SIDE */}
      <section className="relative flex flex-1 items-center justify-center bg-[#131314] px-6 py-12 lg:px-16">

        {/* FORM GLOW */}
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B82F6]/5 blur-[120px]" />

        <div className="relative z-10 w-full max-w-[430px]">

          {/* MOBILE LOGO */}
          <div className="mb-12 flex items-center gap-3 lg:hidden">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6]">

              <span className="font-bold text-white">
                M
              </span>

            </div>

            <span className="text-xl font-bold tracking-tight">
              MCP Builder
            </span>

          </div>

          {/* HEADER */}
          <div className="mb-10">

            <h1 className="mb-2 text-[34px] font-semibold tracking-[-0.03em]">
              Welcome to MCP Builder
            </h1>

            <p className="text-[16px] text-[#C2C6D6]">
              Create AI-native infrastructure tools instantly.
            </p>

          </div>

          {/* GOOGLE LOGIN */}
          <div className="space-y-5">

            <button
              onClick={signInWithGoogle}
              disabled={!acceptedTerms || loading}
              type="button"
              className={`group flex h-14 w-full items-center justify-center gap-3 rounded-2xl border transition-all duration-300 ${
                acceptedTerms
                  ? "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
                  : "cursor-not-allowed border-white/[0.03] bg-white/[0.01] opacity-50"
              }`}
            >

              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5 transition-transform group-hover:scale-110"
              />

              <span className="font-medium">
                {loading
                  ? "Redirecting..."
                  : "Continue with Google"}
              </span>

            </button>

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* TERMS */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">

              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) =>
                  setAcceptedTerms(
                    e.target.checked
                  )
                }
                className="mt-1 h-4 w-4 cursor-pointer rounded-sm border-white/20 bg-transparent"
              />

              <p className="text-[14px] leading-relaxed text-[#C2C6D6]">

                I agree to the{" "}

                <Link
                  href="/terms"
                  className="text-white underline"
                >
                  Terms of Service
                </Link>

                {" "}and{" "}

                <Link
                  href="#"
                  className="text-white underline"
                >
                  Privacy Policy
                </Link>

              </p>

            </div>

          </div>

          {/* FOOTER */}
          <div className="mt-16">

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8C909F]/60">
              © 2026 MCP BUILDER. GLOBAL AI INFRASTRUCTURE.
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}