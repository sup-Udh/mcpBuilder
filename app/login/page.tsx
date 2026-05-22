"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "../../lib/vector/client"
import { useTheme } from "@/lib/theme-context"

export default function LoginPage() {
  const supabase = createClient()
  const { isDark, rotatePalette } = useTheme()

  const [loading, setLoading] =
    useState(false)

  const [acceptedTerms, setAcceptedTerms] =
    useState(false)

  const [error, setError] =
    useState("")

  // Rotate color palette on every login page load
  useEffect(() => {
    rotatePalette()
  }, [])

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
    <main
      className="min-h-screen md:flex"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >

      {/* LEFT SIDE */}
      <section
        className="relative hidden w-[42%] p-8 lg:flex lg:flex-col"
        style={{
          background: 'var(--bg-primary)',
          borderRight: '1px solid var(--border-primary)',
        }}
      >

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid opacity-40" />

        {/* GLOW BACKGROUNDS */}
        <div
          className="animate-pulse-soft absolute left-[-15%] top-[-10%] h-[450px] w-[450px] rounded-full blur-[120px]"
          style={{ background: 'var(--gradient-glow-1)', opacity: 0.15 }}
        />

        <div
          className="animate-pulse-soft absolute right-[-15%] h-[450px] w-[450px] rounded-full blur-[120px]"
          style={{ background: 'var(--gradient-glow-2)', opacity: 0.15 }}
        />

        {/* HEADER */}
        <div className="relative z-20 mb-10 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: 'var(--gradient-primary)',
                boxShadow: '0 0 30px rgba(var(--accent-rgb), 0.35)',
              }}
            >
              <span className="text-lg font-bold text-white">
                M
              </span>
            </div>

            <div>

              <h3 className="text-[20px] font-semibold tracking-tight">
                Control Plane
              </h3>

              <p
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: 'var(--accent-secondary)' }}
              >
                SYSTEM OPERATIONAL V2.4.0
              </p>

            </div>

          </div>

          <div
            className="flex items-center gap-2 rounded-full px-3 py-1"
            style={{
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-elevated)',
            }}
          >

            <div
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: 'var(--status-success)' }}
            />

            <span
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--text-secondary)' }}
            >
              NODE_01 ONLINE
            </span>

          </div>

        </div>

        {/* DASHBOARD */}
        <div className="relative z-10 grid flex-1 grid-cols-12 grid-rows-12 gap-4">

          {/* TERMINAL */}
          <div
            className="col-span-8 row-span-5 rounded-2xl shadow-2xl backdrop-blur-xl"
            style={{
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-card)',
            }}
          >

            {/* TOP BAR */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{
                borderBottom: '1px solid var(--border-primary)',
                background: 'var(--bg-elevated)',
              }}
            >

              <div className="flex gap-1.5">

                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />

              </div>

              <span
                className="font-mono text-[11px]"
                style={{ color: 'var(--text-muted)' }}
              >
                bash — mcp-init.sh
              </span>

            </div>

            {/* TERMINAL BODY */}
            <div className="h-full p-4 font-mono text-[13px]">

              <div className="space-y-1">

                <p style={{ color: 'var(--accent-primary)' }}>
                  $ npm install @model-context-protocol/sdk
                </p>

                <p className="opacity-60">
                  added 42 packages and audited 43 packages in 2s
                </p>

                <p className="mt-3" style={{ color: 'var(--accent-primary)' }}>
                  $ mcp-cli provision --provider claude-3-5
                </p>

                <div className="mt-1 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>

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
          <div
            className="relative col-span-4 row-span-7 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
            style={{
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-card)',
            }}
          >

            <div
              className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--text-secondary)' }}
            >
              Pipeline Flow
            </div>

            <div className="flex h-full flex-col items-center justify-center gap-8">

              {/* SOURCE */}
              <div
                className="relative z-10 flex h-14 w-full items-center gap-3 rounded-xl px-3"
                style={{
                  border: '1px solid var(--border-primary)',
                  background: 'var(--bg-elevated)',
                }}
              >

                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ background: 'var(--accent-primary)' }}
                  />
                </div>

                <div>

                  <p
                    className="font-mono text-[10px] uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Source
                  </p>

                  <p className="text-xs font-bold">
                    Vector DB
                  </p>

                </div>

              </div>

              {/* CONNECTION */}
              <div className="relative flex h-20 items-center justify-center">

                <div
                  className="absolute h-full w-[2px]"
                  style={{ background: 'var(--border-primary)' }}
                />

                <div
                  className="animate-pulse absolute h-10 w-[2px]"
                  style={{ background: 'var(--gradient-primary)' }}
                />

              </div>

              {/* PROCESSOR */}
              <div
                className="animate-node-pulse relative z-10 flex h-16 w-full items-center gap-3 rounded-xl px-3"
                style={{
                  border: '1px solid var(--accent-primary)',
                  background: 'rgba(var(--accent-rgb), 0.1)',
                  boxShadow: '0 0 30px rgba(var(--accent-rgb), 0.2)',
                }}
              >

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background: 'var(--gradient-primary)',
                    boxShadow: '0 0 20px rgba(var(--accent-rgb), 0.35)',
                  }}
                >

                  <div className="h-4 w-4 rounded-full bg-white" />

                </div>

                <div>

                  <p
                    className="font-mono text-[10px] uppercase"
                    style={{ color: 'var(--accent-secondary)' }}
                  >
                    Processor
                  </p>

                  <p className="text-xs font-bold">
                    Claude 3.5 Sonnet
                  </p>

                </div>

              </div>

              {/* CONNECTION */}
              <div className="relative flex h-20 items-center justify-center">

                <div
                  className="absolute h-full w-[2px]"
                  style={{ background: 'var(--border-primary)' }}
                />

                <div
                  className="animate-pulse absolute h-10 w-[2px]"
                  style={{ background: 'linear-gradient(to bottom, var(--accent-purple), transparent)' }}
                />

              </div>

              {/* OUTPUT */}
              <div
                className="relative z-10 flex h-14 w-full items-center gap-3 rounded-xl px-3"
                style={{
                  border: '1px solid var(--border-primary)',
                  background: 'var(--bg-elevated)',
                }}
              >

                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ background: 'var(--accent-purple)' }}
                  />
                </div>

                <div>

                  <p
                    className="font-mono text-[10px] uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
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
          <div
            className="animate-float col-span-5 row-span-4 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
            style={{
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-card)',
            }}
          >

            <div className="flex items-start justify-between">

              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: 'var(--text-secondary)' }}
              >
                Latency / Throughput
              </span>

              <span
                className="text-xs font-bold"
                style={{ color: 'var(--accent-primary)' }}
              >
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
                  stroke="var(--accent-primary)"
                  strokeWidth="2"
                  opacity="0.9"
                />

              </svg>

            </div>

            <div className="mt-4 flex gap-5">

              <div>

                <p
                  className="font-mono text-[9px] uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  CPU
                </p>

                <p className="text-xs font-bold">
                  12%
                </p>

              </div>

              <div>

                <p
                  className="font-mono text-[9px] uppercase"
                  style={{ color: 'var(--text-secondary)' }}
                >
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

          <p
            className="mt-3 max-w-md text-[14px] leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Enterprise-grade infrastructure for the Model Context Protocol. Deploy production-ready connectors to Claude in seconds.
          </p>

        </div>

      </section>

      {/* RIGHT SIDE */}
      <section
        className="relative flex flex-1 items-center justify-center px-6 py-12 lg:px-16"
        style={{ background: 'var(--bg-primary)' }}
      >

        {/* FORM GLOW */}
        <div
          className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{ background: 'var(--gradient-glow-1)', opacity: 0.08 }}
        />

        <div className="relative z-10 w-full max-w-[430px]">

          {/* MOBILE LOGO */}
          <div className="mb-12 flex items-center gap-3 lg:hidden">

            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: 'var(--gradient-primary)' }}
            >

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

            <p style={{ color: 'var(--text-secondary)' }} className="text-[16px]">
              Create AI-native infrastructure tools instantly.
            </p>

          </div>

          {/* GOOGLE LOGIN */}
          <div className="space-y-5">

            <button
              onClick={signInWithGoogle}
              disabled={!acceptedTerms || loading}
              type="button"
              className={`cursor-pointer group flex h-14 w-full items-center justify-center gap-3 rounded-xl border transition-all duration-300 ${
                acceptedTerms
                  ? "hover:brightness-110"
                  : "cursor-not-allowed opacity-50"
              }`}
              style={{
                borderColor: 'var(--border-primary)',
                background: acceptedTerms ? 'var(--bg-card)' : 'var(--bg-elevated)',
              }}
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
              <div
                className="rounded-xl p-4 text-sm"
                style={{
                  border: '1px solid var(--status-error)',
                  background: 'rgba(244,67,54,0.1)',
                  color: 'var(--status-error)',
                }}
              >
                {error}
              </div>
            )}

            {/* TERMS */}
            <div
              className="mt-8 flex items-start gap-3 rounded-xl p-4"
              style={{
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-elevated)',
              }}
            >

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

              <p
                className="text-[14px] leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >

                I agree to the{" "}

                <Link
                  href="/terms"
                  style={{ color: 'var(--text-primary)' }}
                  className="underline"
                >
                  Terms of Service
                </Link>

                {" "}and{" "}

                <Link
                  href="#"
                  style={{ color: 'var(--text-primary)' }}
                  className="underline"
                >
                  Privacy Policy
                </Link>

              </p>

            </div>

          </div>

          {/* FOOTER */}
          <div className="mt-16">

            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--text-muted)', opacity: 0.6 }}
            >
              © 2026 MCP BUILDER. GLOBAL AI INFRASTRUCTURE.
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}