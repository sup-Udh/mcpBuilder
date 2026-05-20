"use client"

import { useParams, useRouter } from "next/navigation"

const servers = [
  {
    id: "docs-context-engine",
    name: "Docs Context Engine",
    type: "DOCUMENTATION",
    endpoint: "mcp://docs-engine.local",
    requests: "12.4k",
    latency: "142ms",
    icon: "description",
  },
  {
    id: "website-knowledge-base",
    name: "Website Knowledge Base",
    type: "WEBSITE",
    endpoint: "mcp://website-runtime.local",
    requests: "8.1k",
    latency: "89ms",
    icon: "language",
  },
]

export default function MCPServerDetails() {

  const params = useParams()
  const router = useRouter()

  const server = servers.find(
    (s) => s.id === params.serverId
  )

  if (!server) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] text-white">

        <div className="rounded-3xl border border-white/10 bg-[#0B1120]/70 px-10 py-8 backdrop-blur-xl">

          <h1 className="text-3xl font-bold">
            MCP Server Not Found
          </h1>

        </div>

      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* GLOWS */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

      {/* TOP NAV */}
      <div className="relative z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => router.back()}
              className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-white/70 transition hover:border-blue-300/20 hover:bg-white/[0.05] hover:text-white active:scale-[0.98]"
            >

              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>

              Back

            </button>

            <div className="hidden h-10 w-px bg-white/10 md:block" />

            <div className="hidden md:block">

              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-200/50">
                MCP SERVER DETAILS
              </p>

              <h1 className="mt-1 text-xl font-semibold">
                {server.name}
              </h1>

            </div>

          </div>

          {/* STATUS */}
          <div className="flex items-center gap-3 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2">

            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-green-300">
              Healthy
            </span>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <section className="relative z-10 px-6 py-10">

        <div className="mx-auto max-w-7xl">

          {/* HERO */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-8 backdrop-blur-xl">

            {/* INNER GLOW */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10" />

            <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

              {/* LEFT */}
              <div className="flex items-start gap-6">

                {/* ICON */}
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] border border-blue-300/10 bg-blue-400/10 shadow-[0_0_50px_rgba(59,130,246,0.15)]">

                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-400/10 to-transparent" />

                  <span className="material-symbols-outlined relative z-10 text-5xl text-blue-200">
                    {server.icon}
                  </span>

                </div>

                {/* INFO */}
                <div>

                  <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-blue-200/50">
                    ACTIVE MCP RUNTIME
                  </p>

                  <h1 className="max-w-2xl text-5xl font-bold tracking-tight">
                    {server.name}
                  </h1>

                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/50">
                    Manage runtime health, vector indexing,
                    semantic ingestion, and AI-ready infrastructure
                    from a unified MCP control layer.
                  </p>

                  {/* TAGS */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">

                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white/60">
                      {server.type}
                    </span>

                    <span className="rounded-full border border-blue-300/10 bg-blue-400/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-blue-200">
                      AI READY
                    </span>

                    <span className="rounded-full border border-violet-300/10 bg-violet-400/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-violet-200">
                      VECTOR ENABLED
                    </span>

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="grid grid-cols-2 gap-4 lg:w-[340px]">

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                    Requests
                  </p>

                  <h2 className="text-3xl font-bold">
                    {server.requests}
                  </h2>

                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                    Latency
                  </p>

                  <h2 className="text-3xl font-bold">
                    {server.latency}
                  </h2>

                </div>

                <div className="col-span-2 rounded-3xl border border-blue-300/10 bg-blue-400/10 p-5">

                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-blue-200/60">
                    Runtime Health
                  </p>

                  <div className="flex items-center justify-between">

                    <h2 className="text-3xl font-bold text-green-300">
                      Operational
                    </h2>

                    <div className="flex items-center gap-2">

                      <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />

                      <span className="font-mono text-xs uppercase tracking-widest text-green-300">
                        Live
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* LOWER GRID */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

            {/* TERMINAL */}
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 backdrop-blur-xl">

              {/* TERMINAL TOP */}
              <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">

                <div className="h-3 w-3 rounded-full bg-red-400/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                <div className="h-3 w-3 rounded-full bg-green-400/70" />

                <span className="ml-4 font-mono text-xs uppercase tracking-widest text-white/40">
                  runtime.logs
                </span>

              </div>

              {/* TERMINAL BODY */}
              <div className="space-y-4 p-6 font-mono text-sm">

                <p className="text-blue-300">
                  &gt; Connecting runtime...
                </p>

                <p className="text-violet-300">
                  &gt; Fetching vector indexes...
                </p>

                <p className="text-cyan-300">
                  &gt; Processing semantic embeddings...
                </p>

                <p className="text-green-300">
                  &gt; MCP runtime operational.
                </p>

                <div className="flex items-center gap-3 pt-3">

                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                  <span className="text-green-300">
                    Listening on runtime endpoint...
                  </span>

                </div>

              </div>

            </div>

            {/* SIDE PANEL */}
            <div className="space-y-6">

              {/* ENDPOINT */}
              <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl">

                <p className="mb-5 font-mono text-xs uppercase tracking-widest text-white/40">
                  MCP Endpoint
                </p>

                <div className="rounded-2xl border border-blue-300/10 bg-blue-400/10 p-4">

                  <code className="break-all font-mono text-sm text-blue-200">
                    {server.endpoint}
                  </code>

                </div>

                <button className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-white/70 transition hover:border-blue-300/20 hover:bg-white/[0.05] hover:text-white active:scale-[0.98]">

                  <span className="material-symbols-outlined text-sm">
                    content_copy
                  </span>

                  Copy Endpoint

                </button>

              </div>

              {/* INFO CARD */}
              <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl">

                <p className="mb-5 font-mono text-xs uppercase tracking-widest text-white/40">
                  Runtime Information
                </p>

                <div className="space-y-5">

                  <div className="flex items-center justify-between">

                    <span className="text-white/50">
                      Embeddings
                    </span>

                    <span className="font-semibold text-white">
                      Enabled
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-white/50">
                      Vector Search
                    </span>

                    <span className="font-semibold text-white">
                      Active
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-white/50">
                      Runtime Version
                    </span>

                    <span className="font-semibold text-white">
                      v1.2.4
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-white/50">
                      Region
                    </span>

                    <span className="font-semibold text-white">
                      US-East
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}