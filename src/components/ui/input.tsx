import { cva, VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive placeholder:text-foreground/40",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground hover:bg-accent/40 disabled:bg-muted disabled:text-muted-foreground focus:ring-primary/70 focus:ring-offset-1 focus:ring-1",
        ghost:
          "border-transparent bg-transparent hover:bg-accent focus:border-border",
      },
      size: {
        default: "h-9",
        sm: "h-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, variant, size, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants, type InputProps }
