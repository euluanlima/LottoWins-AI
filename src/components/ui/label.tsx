"use client"

import React from "react"
import { Root } from "@radix-ui/react-label" // Use named import
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Root // Use named import
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = Root.displayName // Use named import

export { Label }

