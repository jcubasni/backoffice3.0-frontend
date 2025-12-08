import { Label } from "@shadcn/label"
import type { ComponentProps } from "react"
import { Checkbox as CheckboxCustom } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface CheckboxProps extends ComponentProps<typeof CheckboxCustom> {
  label?: string
  classLabel?: string
  classContainer?: string
}

function Checkbox({
  label,
  classLabel,
  classContainer,
  name,
  ...props
}: CheckboxProps) {
  return (
    <div className={cn("flex items-center gap-2", classContainer)}>
      <CheckboxCustom id={name} name={name} {...props} />
      {label && (
        <Label htmlFor={name} className={cn("text-sm", classLabel)}>
          {label}
        </Label>
      )}
    </div>
  )
}

export { Checkbox, type CheckboxProps }
