"use client"

import React from "react"
import { Root, Indicator } from "@radix-ui/react-checkbox" // Use named imports
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root // Use named import
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <Indicator // Use named import
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </Indicator>
  </Root>
))
Checkbox.displayName = Root.displayName // Use named import

export { Checkbox }

