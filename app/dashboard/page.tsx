import Sidebar from "../../components/dashboard/sidebar"
import TopNavbar from "../../components/dashboard/top-navbar"
import ServerCard from "../../components/dashboard/server-card"
import ActivityFeed from "../../components/dashboard/activity-feed"
import TerminalPanel from "../../components/dashboard/terminal-panel"
import FloatingButton from "../../components/dashboard/floating-button"

const servers = [
  {
    name: "Docs-Context-Engine",
    type: "DOCS",
    status: "Running",
    model: "Claude 3.5 Sonnet",
    requests: "12.4k / 24h",
    uptime: "99.98%",
    latency: "142ms",
    endpoint: "mcp://engine.local:3001",
    icon: "terminal",
    color: "text-blue-400",
  },
  {
    name: "GitHub-Repo-Analyzer",
    type: "GITHUB",
    status: "Indexing",
    model: "GPT-4o",
    requests: "2.1k / 24h",
    uptime: "100%",
    latency: "--",
    endpoint: "mcp://git-analyser.prod:8080",
    icon: "source",
    color: "text-violet-400",
  },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <Sidebar />

      <TopNavbar />

      <div className="ml-64 mt-16 h-[calc(100vh-64px)] overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* HEADER */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Infrastructure Overview
              </h1>

              <p className="mt-2 text-white/50">
                Managing 8 active MCP nodes across 3 clusters.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

              <span className="text-sm text-white/70">
                Systems Operational
              </span>
            </div>
          </div>

          {/* SERVER GRID */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {servers.map((server) => (
              <ServerCard
                key={server.name}
                {...server}
              />
            ))}

            {/* CREATE MCP */}
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 p-8 transition hover:border-blue-500/40 hover:bg-white/[0.02]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.03]">
                <span className="material-symbols-outlined text-3xl text-white/60">
                  add
                </span>
              </div>

              <h3 className="text-lg font-semibold">
                Provision New MCP
              </h3>

              <p className="mt-2 text-center text-sm text-white/50">
                Connect a new data source
              </p>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <ActivityFeed />

            <div className="xl:col-span-2">
              <TerminalPanel />
            </div>
          </div>

        </div>
      </div>

      <FloatingButton />
    </main>
  )
}