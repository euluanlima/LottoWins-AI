"use client"

import React from "react"
import { Root, Viewport, ScrollAreaScrollbar, ScrollAreaThumb, Corner } from "@radix-ui/react-scroll-area" // Use named imports

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, children, ...props }, ref) => (
  <Root // Use named import
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <Viewport className="h-full w-full rounded-[inherit]"> {/* Use named import */}
      {children}
    </Viewport>
    <ScrollBar />
    <Corner /> {/* Use named import */}
  </Root>
))
ScrollArea.displayName = Root.displayName // Use named import

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaScrollbar // Use named import
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaThumb className="relative flex-1 rounded-full bg-border" /> {/* Use named import */}
  </ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaScrollbar.displayName // Use named import

export { ScrollArea, ScrollBar }

