import { Label } from "@shadcn/label"
import { Textarea as CustomTextarea } from "@shadcn/textarea"
import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends HTMLAttributes<HTMLTextAreaElement> {
  label?: string
  orientation?: "horizontal" | "vertical"
  classContainer?: HTMLAttributes<HTMLDivElement>["className"]
  classLabel?: HTMLAttributes<HTMLLabelElement>["className"]
}

function Textarea({
  label,
  orientation = "vertical",
  classContainer,
  classLabel,
  ...props
}: TextareaProps) {
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
        <CustomTextarea name={label} id={label} {...props} />
      </div>
    </div>
  )
}

export { Textarea, type TextareaProps }
