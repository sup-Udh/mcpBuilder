"use client"

import Link from "next/link"

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white md:flex">

      {/* LEFT SIDE */}
      <section className="relative hidden w-1/2 overflow-hidden border-r border-white/5 bg-[#020617] p-8 md:flex md:flex-col">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* GLOWS */}
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />

        {/* TOP */}
        <div className="relative z-20 mb-12 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.4)]">
              <span className="text-xl font-bold">
                M
              </span>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                MCP Builder
              </h3>

              <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400">
                SYSTEM OPERATIONAL
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">

            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

            <span className="font-mono text-[10px] uppercase text-white/60">
              ONLINE
            </span>

          </div>

        </div>

        {/* DASHBOARD */}
        <div className="relative z-10 grid flex-1 grid-cols-12 grid-rows-12 gap-4">

          {/* TERMINAL */}
          <div className="col-span-8 row-span-5 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">

            <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-4 py-2">

              <div className="flex gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>

              <span className="font-mono text-xs text-white/40">
                deployment.log
              </span>

            </div>

            <div className="space-y-2 p-4 font-mono text-sm">

              <p className="text-blue-400">
                $ npm install @mcp/sdk
              </p>

              <p className="text-white/40">
                installing dependencies...
              </p>

              <p className="text-blue-400">
                $ mcp deploy production
              </p>

              <p className="animate-pulse text-green-400">
                Connecting to Claude Desktop...
              </p>

              <div className="mt-4 space-y-1 text-white/30">

                <p>&gt; Provisioning vector database...</p>
                <p>&gt; Indexing semantic nodes...</p>
                <p>&gt; Building infrastructure...</p>
                <p>&gt; Creating deployment endpoint...</p>
                <p>&gt; Deploying globally...</p>

              </div>

            </div>

          </div>

          {/* PIPELINE */}
          <div className="col-span-4 row-span-7 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">

            <div className="mb-6 font-mono text-[10px] uppercase tracking-widest text-white/50">
              Pipeline Flow
            </div>

            <div className="flex h-full flex-col items-center justify-center gap-8">

              {/* NODE */}
              <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4">

                <p className="mb-1 font-mono text-[10px] uppercase text-white/40">
                  SOURCE
                </p>

                <h3 className="font-semibold">
                  Vector Database
                </h3>

              </div>

              {/* LINE */}
              <div className="h-16 w-[2px] bg-gradient-to-b from-blue-500 to-violet-500" />

              {/* NODE */}
              <div className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 shadow-[0_0_40px_rgba(59,130,246,0.2)]">

                <p className="mb-1 font-mono text-[10px] uppercase text-blue-300">
                  PROCESSOR
                </p>

                <h3 className="font-semibold">
                  Claude Sonnet
                </h3>

              </div>

              {/* LINE */}
              <div className="h-16 w-[2px] bg-gradient-to-b from-violet-500 to-white/10" />

              {/* NODE */}
              <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4">

                <p className="mb-1 font-mono text-[10px] uppercase text-white/40">
                  OUTPUT
                </p>

                <h3 className="font-semibold">
                  localhost:8080
                </h3>

              </div>

            </div>

          </div>

          {/* METRICS */}
          <div className="col-span-5 row-span-4 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">

            <div className="mb-6 flex items-center justify-between">

              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                Infrastructure
              </span>

              <span className="text-sm font-bold text-blue-400">
                14ms
              </span>

            </div>

            <div className="h-24 w-full rounded-xl bg-gradient-to-r from-blue-500/20 to-violet-500/20" />

          </div>

          {/* DEPLOY */}
          <div className="col-span-3 row-span-3 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">

            <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/50">
              Deployment
            </div>

            <div className="mb-3 flex items-center justify-between text-sm">

              <span className="text-white/60">
                main-branch
              </span>

              <span className="animate-pulse text-blue-400">
                Deploying
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">

              <div className="h-full w-[70%] animate-pulse rounded-full bg-blue-500" />

            </div>

          </div>

          {/* EXECUTION */}
          <div className="col-span-7 row-span-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/20">

                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

              </div>

              <div>

                <p className="text-sm font-semibold">
                  Processing AI Tool Execution
                </p>

                <p className="font-mono text-xs text-white/40">
                  semantic_search("mcp_docs")
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* FOOTER TEXT */}
        <div className="relative z-20 mt-12">

          <h2 className="max-w-md text-4xl font-bold leading-tight">
            Build AI-ready MCP servers in minutes.
          </h2>

          <p className="mt-4 max-w-lg text-white/50">
            Enterprise-grade infrastructure for the Model Context Protocol.
          </p>

        </div>

      </section>

      {/* RIGHT SIDE */}
      <section className="relative flex min-h-screen flex-1 items-center justify-center p-6 md:p-10">

        {/* GLOW */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-blue-500/5 blur-[120px]" />

        <div className="relative z-10 w-full max-w-[420px]">

          {/* MOBILE LOGO */}
          <div className="mb-12 flex items-center gap-3 md:hidden">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <span className="font-bold text-white">
                M
              </span>
            </div>

            <span className="text-2xl font-bold">
              MCP Builder
            </span>

          </div>

          {/* HEADER */}
          <div className="mb-10">

            <h1 className="mb-3 text-5xl font-bold tracking-tight">
              Welcome Back
            </h1>

            <p className="text-white/50">
              Create AI-native infrastructure tools instantly.
            </p>

          </div>

          {/* SOCIAL */}
          <div className="mb-8 space-y-3">

            <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.05]">

              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY4WNBcTJm8taXcmMjLDoAN6mNV2vo6VyCbV6UZ47Risab1W6mjgUU-gM5T8AKScjpkJAzzWCaW5m6HvRcTshV5XZEBs1JDXJMFvLUx4mckkYJKlRpesPkGnljDAiKaxRnmLb9ZURAb_FPHUY9-PPCGHfwmRrE63gF2-Rv3wEreeAaS_XYoTWmuH6Uu3F-D_H2KOb1OlEHiIGpXigtzr-jAD8AmY_j1xeV0ZlWK8wCwPzDiwurVgWGvlphz0laTU_PIIOSpTG-dDNb"
                alt="Google"
                className="h-5 w-5"
              />

              Continue with Google

            </button>

            <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.05]">

              <span className="text-xl">
                ⌘
              </span>

              Continue with GitHub

            </button>

          </div>

          {/* DIVIDER */}
          <div className="mb-8 flex items-center gap-4">

            <div className="h-px flex-1 bg-white/10" />

            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              OR EMAIL
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

          {/* FORM */}
          <form className="space-y-6">

            <div className="space-y-5">

              <div>

                <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-white/50">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white outline-none transition focus:border-blue-500"
                />

              </div>

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                    Password
                  </label>

                  <button
                    type="button"
                    className="font-mono text-[11px] uppercase tracking-widest text-blue-400"
                  >
                    Forgot?
                  </button>

                </div>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white outline-none transition focus:border-blue-500"
                />

              </div>

            </div>

            {/* BUTTON */}
            <button className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#3B82F6] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]">

              Continue with Email

              <span>
                →
              </span>

            </button>

            {/* TERMS */}
            <div className="flex items-start gap-3">

              <input
                type="checkbox"
                className="mt-1 h-4 w-4 cursor-pointer rounded border-white/20 bg-transparent"
              />

              <p className="text-sm leading-relaxed text-white/50">

                I agree to the{" "}

                <Link
                  href="#"
                  className="text-white underline"
                >
                  Terms
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

          </form>

          {/* LOGIN */}
          <div className="mt-12 text-center">

            <p className="text-white/50">

              Already have an account?{" "}

              <Link
                href="#"
                className="font-semibold text-blue-400 hover:underline"
              >
                Log in
              </Link>

            </p>

          </div>

          {/* FOOTER */}
          <div className="mt-16">

            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              © 2026 MCP BUILDER
            </p>

          </div>

        </div>

      </section>

    </main>
  )
}