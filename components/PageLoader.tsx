"use client"

export default function PageLoader() {
  return (
    <>
      <div className="page-loader fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#020617]">

        {/* GRID */}
        <div className="absolute inset-0 opacity-40 grid-bg" />

        {/* GLOW */}
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center">

          {/* LOGO */}
          <div className="loader-ring mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-300/20 bg-blue-400/10 backdrop-blur-xl">

            <span className="material-symbols-outlined text-5xl text-blue-200">
              dns
            </span>

          </div>

          {/* TITLE */}
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
            MCP Builder
          </h1>

          {/* SUBTEXT */}
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-blue-200/60">
            Loading Workspace
          </p>

          {/* LOADING BAR */}
          <div className="mt-8 h-[3px] w-[220px] overflow-hidden rounded-full bg-white/10">

            <div className="loading-bar h-full w-full" />

          </div>

        </div>

      </div>

      {/* GOOGLE ICONS */}
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

        .page-loader {
          animation: fadeIn 0.35s ease forwards;
        }

        .loader-ring {
          animation: pulseGlow 2s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(59,130,246,0.15);
        }

        .loading-bar {
          background: linear-gradient(
            to right,
            transparent,
            #93c5fd,
            transparent
          );

          animation: loadingMove 1.2s linear infinite;
        }

        @keyframes loadingMove {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}