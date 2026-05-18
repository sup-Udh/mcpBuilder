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
        "rounded-3xl h-full w-full pt-8 pb-8",
        "bg-white/[0.03]",
        "backdrop-blur-xl",
        "shadow-[0_8px_40px_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {children}
    </div>
  )
}