"use client"

import React from "react"
import { Provider, Root, Trigger, Portal, Content } from "@radix-ui/react-tooltip" // Use named imports

import { cn } from "@/lib/utils"

const TooltipProvider = Provider // Use named import

const Tooltip = Root // Use named import

const TooltipTrigger = Trigger // Use named import

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Portal> {/* Use named import */}
    <Content // Use named import
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </Portal>
))
TooltipContent.displayName = Content.displayName // Use named import

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

