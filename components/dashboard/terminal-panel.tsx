export default function TerminalPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050506]">

      <div className="flex items-center justify-between border-b border-white/10 bg-[#0A0A0B] px-4 py-3">

        <div className="flex gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>

        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
          mcp-builder-cli --debug
        </span>

        <div />

      </div>

      <div className="space-y-1 p-5 font-mono text-sm">

        <p className="text-white/70">
          <span className="text-green-400">
            ➜
          </span>{" "}
          mcp status --all
        </p>

        <p className="text-white/50">
          Fetching node health...
        </p>

        <p className="text-green-400">
          [OK] docs-engine.local (142ms)
        </p>

        <p className="text-blue-400">
          [INFO] indexing in progress...
        </p>

        <p className="text-red-400">
          [ERR] connection refused
        </p>

      </div>

    </div>
  )
}