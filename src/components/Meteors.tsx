"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface MeteorsProps {
  className?: string
  children?: React.ReactNode
  count?: number
  angle?: number
  color?: string
  tailColor?: string
}

interface MeteorData {
  id: number
  left: number
  delay: number
  duration: number
}

export function Meteors({
  className,
  children,
  count = 20,
  angle = 215,
  color = "hsl(var(--muted-foreground))",
  tailColor = "hsl(var(--muted-foreground))",
}: MeteorsProps) {
  const [meteors, setMeteors] = useState<MeteorData[]>([])

  useEffect(() => {
    setMeteors(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: i * (100 / count),
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 7,
      }))
    )
  }, [count])

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <style>{`
        @keyframes meteor-fall {
          0% {
            transform: rotate(${angle}deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(${angle}deg) translateX(-100vmax);
            opacity: 0;
          }
        }
      `}</style>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />

      {/* Meteors */}
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="pointer-events-none absolute top-0"
          style={{
            left: `${meteor.left}%`,
            animationName: "meteor-fall",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
          }}
        >
          {/* Head */}
          <span
            className="block w-[1px] h-[1px] rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 2px 1px ${color}`,
            }}
          />
          {/* Tail */}
          <span
            className="block w-[1px] h-[80px] -mt-[1px]"
            style={{
              background: `linear-gradient(to bottom, ${tailColor}, transparent)`,
            }}
          />
        </span>
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_50%,hsl(var(--background))_100%)]" />

      {/* Content layer */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  )
}

export default Meteors
