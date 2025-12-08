import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden select-none",
  {
    variants: {
      variant: {
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        blue: "border border-blue-900/10 bg-blue-200/60 text-blue-900/60 dark:border-0 dark:bg-blue-400/30 dark:text-blue-200 dark:ring-blue-400/30",
        red: "border border-red-900/10 bg-red-500/20 text-red-900/60 dark:border-0 dark:bg-red-400/30 dark:text-pink-200 dark:ring-red-400",
        green:
          "border border-green-900/10 bg-green-200/50 text-green-900/60 dark:border-0 dark:bg-green-400/30 dark:text-green-200 dark:ring-green-400/30",
        amber:
          "border border-amber-900/10 bg-orange-100/90 text-amber-900/60 dark:border-0 dark:bg-amber-400/30 dark:text-amber-200 dark:ring-amber-400/30",
        purple:
          "border border-purple-900/10 bg-purple-200/60 text-purple-900/60 dark:border-0 dark:bg-purple-400/30 dark:text-purple-200 dark:ring-purple-400/30",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
