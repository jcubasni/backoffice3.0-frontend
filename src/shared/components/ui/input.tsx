import { Button } from "@shadcn/button"
import { Input as CustomInput, type InputProps as InputP } from "@shadcn/input"
import { Label } from "@shadcn/label"
import type { LucideIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends InputP {
  label?: string
  icon?: LucideIcon
  iconClick?: () => void
  classIcon?: string
  classButton?: string
  orientation?: "horizontal" | "vertical"
  classContainer?: HTMLAttributes<HTMLDivElement>["className"]
  classLabel?: HTMLAttributes<HTMLLabelElement>["className"]
}

function Input({
  label,
  icon: Icon,
  iconClick,
  classIcon,
  classButton,
  orientation = "vertical",
  classContainer,
  classLabel,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        "flex gap-2 text-sm",
        orientation === "vertical"
          ? "flex-col"
          : "items-center justify-center gap-4",
        classContainer,
      )}
    >
      {label && (
        <Label htmlFor={label} className={cn("w-fit leading-4", classLabel)}>
          {label}
        </Label>
      )}
      <div className="relative flex w-full flex-1 justify-end">
        <CustomInput
          name={label}
          id={label}
          {...props}
          className={cn(Icon && "pr-9", props.className)}
        />
        {Icon && (
          <Button
            tabIndex={-1}
            variant={"none"}
            size={"none"}
            type="button"
            className={cn(
              "absolute top-0 right-0 flex h-full w-1/12 min-w-8 items-center justify-center",
              !iconClick && "hover:cursor-default",
              iconClick &&
                !props.disabled &&
                "rounded-r border-l hover:bg-gray-400/20",
              classButton,
            )}
            onClick={props.disabled ? undefined : iconClick}
            onTouchStart={props.disabled ? undefined : iconClick}
            onTouchEnd={props.disabled ? undefined : iconClick}
          >
            <Icon className={cn("h-2/5", classIcon)} />
          </Button>
        )}
      </div>
    </div>
  )
}

export { Input, type InputProps }
