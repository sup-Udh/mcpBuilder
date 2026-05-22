"use client"

export default function PageLoader() {
  return (
    <>
      <div className="page-loader fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>

        {/* GRID */}
        <div className="absolute inset-0 opacity-40 grid-bg" />

        {/* GLOW */}
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" style={{ background: 'var(--gradient-glow-1)' }} />

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center">

          {/* LOGO */}
          <div className="loader-ring mb-6 flex h-20 w-20 items-center justify-center rounded-3xl backdrop-blur-xl" style={{ border: '1px solid var(--border-accent)', background: 'rgba(var(--accent-rgb), 0.1)' }}>

            <span className="material-symbols-outlined text-5xl" style={{ color: 'var(--accent-primary)' }}>
              dns
            </span>

          </div>

          {/* TITLE */}
          <h1 className="mb-3 text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            MCP Builder
          </h1>

          {/* SUBTEXT */}
          <p className="font-mono text-xs uppercase tracking-[0.35em]" style={{ color: 'var(--text-muted)' }}>
            Loading Workspace
          </p>

          {/* LOADING BAR */}
          <div className="mt-8 h-[3px] w-[220px] rounded-full" style={{ background: 'var(--bg-elevated)' }}>

            <div className="loading-bar h-full w-full" />

          </div>

        </div>

      </div>

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
          box-shadow: 0 0 40px rgba(var(--accent-rgb), 0.15);
        }

        .loading-bar {
          background: linear-gradient(
            to right,
            transparent,
            var(--accent-primary),
            var(--accent-secondary),
            transparent
          );

          animation: loadingMove 1.2s linear infinite;
        }

        @keyframes loadingMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}