export default function TopNavbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#020617]/80 px-6 backdrop-blur-xl">

      {/* SEARCH */}
      <div className="relative w-full max-w-xl">

        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          search
        </span>

        <input
          type="text"
          placeholder="Search infrastructure..."
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
        />

      </div>

      {/* RIGHT */}
      <div className="ml-6 flex items-center gap-5">

        <button className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2 font-semibold text-white transition hover:brightness-110">

          <span className="material-symbols-outlined">
            add
          </span>

          Create MCP Server

        </button>

        <button className="relative text-white/60 transition hover:text-white">

          <span className="material-symbols-outlined">
            notifications
          </span>

          <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />

        </button>

        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="h-9 w-9 rounded-full border border-white/10"
        />

      </div>

    </header>
  )
}