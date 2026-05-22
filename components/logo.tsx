import React from "react"

interface LogoProps {
  className?: string
  size?: number
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="logoBorderGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="50%" stopColor="#FF4081" />
          <stop offset="100%" stopColor="#7C4DFF" />
        </linearGradient>
        <linearGradient id="logoLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#FF4081" />
        </linearGradient>
        <linearGradient id="logoRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4081" />
          <stop offset="100%" stopColor="#7C4DFF" />
        </linearGradient>
      </defs>
      
      {/* Outer Rounded Box */}
      <rect x="6" y="6" width="88" height="88" rx="26" fill="#030008" stroke="url(#logoBorderGrad)" strokeWidth="4.5" />
      
      {/* Inner Chevrons */}
      <path d="M 58 29 L 36 50 L 58 71" fill="none" stroke="url(#logoLeftGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 42 29 L 64 50 L 42 71" fill="none" stroke="url(#logoRightGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
