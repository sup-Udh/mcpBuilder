export default function Sidebar() {
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

        <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-white/60 transition hover:bg-white/[0.03] hover:text-white">
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

      {/* FOOTER */}
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.02] p-4">

        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            Resource Usage
          </span>

          <span className="text-[10px] text-blue-400">
            82%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[82%] bg-[#3B82F6]" />
        </div>

      </div>

    </aside>
  )
}