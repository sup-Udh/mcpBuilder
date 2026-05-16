export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <div className="h-8 w-8 rounded-lg bg-blue-500" />

          <span className="font-semibold tracking-tight">
            MCP Builder
          </span>
        </div>

        {/* CENTER */}
        <div className="flex gap-8 text-white/60">
          <a href="#" className="hover:text-white">
            Docs
          </a>

          <a href="#" className="hover:text-white">
            GitHub
          </a>

          <a href="#" className="hover:text-white">
            Pricing
          </a>
        </div>

        {/* RIGHT */}
        <p className="text-sm text-white/40">
          © 2026 MCP Builder. Infrastructure for the AI generation.
        </p>

      </div>
    </footer>
  )
}