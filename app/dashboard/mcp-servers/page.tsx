"use client"
import Sidebar from "@/components/dashboard/sidebar"

// main toggler
const hasServers = false

const servers = [
  {
    name: "Docs Context Engine",
    type: "DOCUMENTATION",
    status: "Running",
    endpoint: "mcp://docs-engine.local",
    requests: "12.4k",
    latency: "142ms",
    icon: "description",
    glow: "from-blue-500/20 to-cyan-500/10",
  },
  {
    name: "Website Knowledge Base",
    type: "WEBSITE",
    status: "Indexing",
    endpoint: "mcp://website-runtime.local",
    requests: "8.1k",
    latency: "89ms",
    icon: "language",
    glow: "from-violet-500/20 to-fuchsia-500/10",
  },
]

export default function McpServers() {
  return (
    <>
    <Sidebar />
    <main className="relative min-h-screen bg-[#020617] text-white">

      {/* MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      {/* GRID BACKGROUND */}
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

      {/* GLOW EFFECTS */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

      {/* CONTENT */}
      <section className="relative z-10 px-6 py-16">

        {/* HEADER */}
        <div className="mx-auto mb-12 flex max-w-7xl items-end justify-between">

          <div>

            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-blue-200/50">
              MCP INFRASTRUCTURE
            </p>

            <h1 className="text-5xl font-bold tracking-tight">
              MCP Servers
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-white/50">
              Manage deployed runtimes, ingestion sources, embeddings,
              vector indexing, and live MCP infrastructure.
            </p>

          </div>

          {/* CREATE BUTTON */}
          <button className="flex cursor-pointer items-center gap-3 rounded-2xl bg-blue-200 px-6 py-4 font-semibold text-[#020617] shadow-[0_0_30px_rgba(173,198,255,0.25)] transition hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]">

            <span className="material-symbols-outlined">
              add
            </span>

            Create MCP Server

          </button>

        </div>

        {/* CONDITIONAL */}
        {!hasServers ? (

          /* EMPTY STATE */
<div className="mx-auto flex min-h-[42vh] max-w-4xl flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-14 backdrop-blur-xl">
            {/* ICON */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-white/10 bg-blue-400/10 shadow-[0_0_50px_rgba(59,130,246,0.15)]">

              <span className="material-symbols-outlined text-5xl text-blue-200">
                dns
              </span>

            </div>

            {/* TEXT */}
                <h2 className="mb-3 text-center text-3xl font-bold tracking-tight">
              No MCP Servers Yet

            </h2>

<p className="mb-8 max-w-xl text-center text-base leading-relaxed text-white/50">
              You haven’t provisioned any MCP servers yet. Start by creating
              your first runtime to ingest websites, documentation, PDFs,
              and AI-ready knowledge sources.

            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center justify-center gap-4">

              <button className="flex cursor-pointer items-center gap-3 rounded-2xl bg-blue-200 px-8 py-4 font-semibold text-[#020617] shadow-[0_0_35px_rgba(173,198,255,0.25)] transition hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]">

                <span className="material-symbols-outlined">
                  rocket_launch
                </span>

                Create First MCP

              </button>

              <button className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-white/70 backdrop-blur-xl transition hover:border-blue-300/20 hover:bg-white/[0.05] hover:text-white active:scale-[0.98]">

                <span className="material-symbols-outlined">
                  auto_awesome
                </span>

                View Documentation

              </button>

            </div>

            {/* INFO CARDS */}
<div className="mt-12 grid w-full grid-cols-1 gap-4 md:grid-cols-3">

             

          </div>
          </div>


        ) : (

          /* SERVERS GRID */
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {servers.map((server) => (
              <div
                key={server.name}
                className="group relative rounded-3xl border border-white/10 bg-[#0B1120]/70 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-300/20 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]"
              >

                {/* GLOW */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${server.glow} opacity-0 transition duration-500 group-hover:opacity-100`}
                />

                {/* CONTENT */}
                <div className="relative z-10">

                  {/* TOP */}
                  <div className="mb-6 flex items-start justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">

                        <span className="material-symbols-outlined text-3xl text-blue-200">
                          {server.icon}
                        </span>

                      </div>

                      <div>

                        <h3 className="text-xl font-semibold">
                          {server.name}
                        </h3>

                        <div className="mt-2 flex items-center gap-2">

                          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/60">
                            {server.type}
                          </span>

                          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-green-300">

                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                            {server.status}

                          </span>

                        </div>

                      </div>

                    </div>

                    <button className="cursor-pointer text-white/40 transition hover:text-white">

                      <span className="material-symbols-outlined">
                        more_vert
                      </span>

                    </button>

                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-2 gap-y-5 border-y border-white/5 py-6">

                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                        Requests
                      </p>

                      <p className="font-semibold">
                        {server.requests}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                        Latency
                      </p>

                      <p className="font-semibold">
                        {server.latency}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                        Runtime
                      </p>

                      <p className="font-semibold">
                        Active
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                        Status
                      </p>

                      <p className="font-semibold text-green-300">
                        Healthy
                      </p>
                    </div>

                  </div>

                  {/* ENDPOINT */}
                  <div className="mt-6 flex items-center justify-between">

                    <code className="rounded-xl bg-blue-400/10 px-3 py-2 font-mono text-xs text-blue-200">
                      {server.endpoint}
                    </code>

                    <button className="cursor-pointer text-white/40 transition hover:text-blue-200">

                      <span className="material-symbols-outlined">
                        content_copy
                      </span>

                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

        )}

      </section>

    </main>
    </>
  )
}