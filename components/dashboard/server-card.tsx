interface Props {
  name: string
  type: string
  status: string
  model: string
  requests: string
  uptime: string
  latency: string
  endpoint: string
  icon: string
  color: string
}

export default function ServerCard({
  name,
  type,
  status,
  model,
  requests,
  uptime,
  latency,
  endpoint,
  icon,
  color,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-5 transition hover:border-blue-500/30">

      <div className="mb-5 flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03]">
            <span className={`material-symbols-outlined ${color}`}>
              {icon}
            </span>
          </div>

          <div>
            <h3 className="font-semibold">
              {name}
            </h3>

            <div className="mt-1 flex items-center gap-2">

              <span className="rounded border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/40">
                {type}
              </span>

              <span className="flex items-center gap-1 text-[11px] text-green-400">

                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                {status}

              </span>

            </div>

          </div>

        </div>

        <button className="text-white/40 transition hover:text-white">
          <span className="material-symbols-outlined">
            more_vert
          </span>
        </button>

      </div>

      <div className="grid grid-cols-2 gap-y-4 border-y border-white/5 py-4 text-sm">

        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">
            AI MODEL
          </p>

          <p>{model}</p>
        </div>

        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">
            REQUESTS
          </p>

          <p>{requests}</p>
        </div>

        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">
            UPTIME
          </p>

          <p>{uptime}</p>
        </div>

        <div>
          <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">
            LATENCY
          </p>

          <p>{latency}</p>
        </div>

      </div>

      <div className="mt-4 flex items-center justify-between">

        <code className="rounded bg-blue-500/5 px-2 py-1 font-mono text-xs text-blue-300">
          {endpoint}
        </code>

        <button className="text-white/40 transition hover:text-blue-400">
          <span className="material-symbols-outlined">
            content_copy
          </span>
        </button>

      </div>

    </div>
  )
}