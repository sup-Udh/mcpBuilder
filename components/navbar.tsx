export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* LEFT */}
        <div className="flex items-center gap-10">

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500" />

            <span className="text-xl font-bold tracking-tight">
              MCP Builder
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a className="text-blue-400 font-semibold" href="#">
              Features
            </a>

            <a className="text-white/60 hover:text-white transition-colors" href="#">
              Docs
            </a>

            <a className="text-white/60 hover:text-white transition-colors" href="#">
              Pricing
            </a>

            <a className="text-white/60 hover:text-white transition-colors" href="#">
              GitHub
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <button className="rounded-lg bg-blue-500 px-5 py-2 font-semibold text-black transition hover:scale-105">
          Get Started
        </button>
      </div>
    </nav>
  )
}