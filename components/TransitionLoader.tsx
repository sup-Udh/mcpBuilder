"use client"
//  use this for the deply loader.
export default function TransitionLoader() {
  return (
    <>
      <div className="animate-fade fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#020617]">

        {/* GRID */}
        <div className="grid-bg absolute inset-0 opacity-40" />

        {/* GLOW ORBS */}
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

        {/* SCANNER */}
        <div className="absolute inset-0 overflow-hidden">

          <div className="scanner-line absolute top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />

        </div>

        {/* CENTER */}
        <div className="relative z-10 flex flex-col items-center">

          {/* LOGO */}
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] border border-blue-300/20 bg-blue-400/10 shadow-[0_0_60px_rgba(59,130,246,0.2)] backdrop-blur-xl">

            <span className="material-symbols-outlined text-6xl text-blue-200">
              dns
            </span>

          </div>

          {/* TITLE */}
          <h1 className="mb-3 text-5xl font-bold tracking-tight text-white">
            MCP Builder
          </h1>

          <p className="mb-10 font-mono text-sm uppercase tracking-[0.35em] text-blue-200/60">
            Initializing Infrastructure
          </p>

          {/* MCP PIPELINE */}
          <div className="mb-10 flex items-center gap-3">

            <div className="rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-xl">
              Runtime
            </div>

            <div className="h-[2px] w-14 overflow-hidden rounded-full bg-white/10">

              <div className="pipeline-flow h-full w-full" />

            </div>

            <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-100 backdrop-blur-xl">
              Vector DB
            </div>

            <div className="h-[2px] w-14 overflow-hidden rounded-full bg-white/10">

              <div className="pipeline-flow-violet h-full w-full" />

            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur-xl">
              MCP
            </div>

          </div>

          {/* TERMINAL */}
          <div className="terminal-window w-[440px] overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-5 font-mono text-sm text-white/70 backdrop-blur-xl">

            {/* TOP BAR */}
            <div className="mb-5 flex items-center gap-2">

              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />

            </div>

            {/* LOGS */}
            <div className="terminal-content space-y-2">

              <p className="text-blue-300">
                &gt; Connecting session...
              </p>

              <p className="text-violet-300">
                &gt; Provisioning infrastructure...
              </p>

              <p className="text-cyan-300">
                &gt; Booting MCP runtime...
              </p>

              <p className="text-white/40">
                &gt; Creating vector indexes...
              </p>

              <p className="text-white/40">
                &gt; Establishing runtime tunnel...
              </p>

              <div className="mt-5 flex items-center gap-2">

                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                <span className="text-green-300">
                  Ready
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

      <style jsx global>{`
        .grid-bg {
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        }

        .animate-fade {
          animation: fadeIn 0.45s ease forwards;
        }

        .scanner-line {
          animation: scan 2s linear infinite;
        }

        .pipeline-flow {
          background: linear-gradient(to right, transparent, #93c5fd, transparent);
          animation: flow 1.2s linear infinite;
        }

        .pipeline-flow-violet {
          background: linear-gradient(to right, transparent, #c4b5fd, transparent);
          animation: flow 1.2s linear infinite;
        }

        .terminal-content {
          animation: terminalFloat 1.8s ease forwards;
        }

        .terminal-window {
          box-shadow:
            0 0 60px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }

          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes flow {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        @keyframes terminalFloat {
          0% {
            transform: translateY(0px);
            opacity: 0;
          }

          40% {
            opacity: 1;
          }

          100% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}