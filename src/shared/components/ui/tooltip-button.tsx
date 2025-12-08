import { Link, LinkProps } from "@tanstack/react-router"
import { LucideIcon } from "lucide-react"
import { ButtonHTMLAttributes, PropsWithChildren } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type TooltipButtonAsButton = {
  tooltip: string
  icon: LucideIcon
  to?: never
  className?: string
} & PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>

type TooltipButtonAsLink = {
  tooltip: string
  icon: LucideIcon
  className?: string
} & Omit<PropsWithChildren<LinkProps>, "children" | "className">

type TooltipButtonProps = TooltipButtonAsButton | TooltipButtonAsLink

export const TooltipButton = (props: TooltipButtonProps) => {
  const { tooltip, icon: Icon, className } = props

  // Si tiene to, renderizar como Link
  if ("to" in props && props.to) {
    const { tooltip: _tooltip, icon: _icon, disabled, ...linkProps } = props

    const linkElement = (
      <Link
        className={cn(
          buttonVariants({ variant: "outline" }),
          "size-6 rounded",
          "text-gray-600 dark:text-gray-200",
          disabled && "opacity-30 hover:bg-transparent hover:text-inherit",
          className,
        )}
        disabled={disabled}
        {...linkProps}
      >
        <Icon />
      </Link>
    )

    if (disabled) {
      return linkElement
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    )
  }

  // Si no tiene href, renderizar como Button
  const { tooltip: _tooltip, icon: _icon, ...buttonProps } = props
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          type="button"
          variant="outline"
          className={cn("disabled:opacity-50", className)}
          {...buttonProps}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

interface TooltipButtonBoxProps extends PropsWithChildren {
  className?: string
}

TooltipButton.Box = function Box({
  children,
  className,
}: TooltipButtonBoxProps) {
  return (
    <div className={cn("mx-auto flex w-fit gap-2", className)}>{children}</div>
  )
}
