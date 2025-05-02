"use client"

import React from "react"
import { Root, Track, Range, Thumb } from "@radix-ui/react-slider" // Use named imports

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root // Use named import
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"> {/* Use named import */}
      <Range className="absolute h-full bg-primary" /> {/* Use named import */}
    </Track>
    <Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" /> {/* Use named import */}
  </Root>
))
Slider.displayName = Root.displayName // Use named import

export { Slider }

