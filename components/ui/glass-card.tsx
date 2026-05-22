import { cn } from "../lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export default function GlassCard({
  children,
  className,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full pt-8 pb-8",
        "bg-[var(--bg-card)]/50",
        "backdrop-blur-md",
        "border border-[var(--border-primary)]",
        "shadow-[0_8px_30px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      {children}
    </div>
  )
}