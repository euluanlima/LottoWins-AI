"use client"

import React from "react"
import { Root, Indicator } from "@radix-ui/react-progress" // Use named imports

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, value, ...props }, ref) => (
  <Root // Use named import
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <Indicator // Use named import
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </Root>
))
Progress.displayName = Root.displayName // Use named import

export { Progress }

