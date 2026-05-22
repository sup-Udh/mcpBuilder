"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#030008] py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12 items-start mb-12">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-tr from-[#FF6B35] via-[#FF4081] to-[#7C4DFF] p-[1.5px]">
                <div className="h-full w-full rounded-[6px] bg-[#030008] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4081]">
                    polymer
                  </span>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
                MCP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4081] to-[#FF6B35]">Builder</span>
              </span>
            </Link>
            <p className="text-sm text-[#7E748B] max-w-xs leading-relaxed">
              Handcrafted infrastructure orchestration. Build, deploy, and index dynamic Model Context Protocol servers in seconds.
            </p>
          </div>

          {/* COLUMN 2: PRODUCT */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-sm text-[#A69EAF]">
              <li>
                <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-white transition-colors duration-200">Pipeline Flow</a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-white transition-colors duration-200">Ecosystem</a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: RESOURCES */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-[#A69EAF]">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-white/20">Privacy Policy (soon)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7E748B]">
            © 2026 MCP Builder. Crafted for the intelligence epoch.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[#A69EAF] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}