import { cn } from "../lib/utils"

interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function GlowButton({
  children,
  className,
  ...props
}: GlowButtonProps) {
  return (
    <button
      className={cn(
        "cursor-pointer",
        "relative rounded-xl",
        "bg-[#3B82F6] text-white",
        "px-8 py-4 font-semibold",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "shadow-[0_0_40px_rgba(59,130,246,0.35)]",
        "before:absolute before:inset-0",
        "before:bg-white/10 before:opacity-0",
        "before:transition-opacity hover:before:opacity-100",
        className
      )}
      {...props}
    >
      <span className="relative z-10">
        {children}
      </span>
    </button>
  )
}