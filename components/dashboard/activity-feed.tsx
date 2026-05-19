export default function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-5">

      <div className="mb-6 flex items-center justify-between">

        <h3 className="text-lg font-semibold">
          Infrastructure Logs
        </h3>

        <span className="text-[10px] uppercase tracking-widest text-white/40">
          LIVE FEED
        </span>

      </div>

      <div className="space-y-5">

        <div className="flex gap-4">
          <div className="mt-2 h-2 w-2 rounded-full bg-blue-400" />

          <div>
            <p className="text-sm">
              Server deployed successfully.
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">
              2 MINUTES AGO
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-2 h-2 w-2 rounded-full bg-violet-400" />

          <div>
            <p className="text-sm">
              New indexing job started.
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">
              14 MINUTES AGO
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}