import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface Option {
  label: string
  value: string
}

interface RadioProps {
  options: Option[]
  label?: string
  name?: string
  orientation?: "horizontal" | "vertical"
  classContainer?: string
  classLabel?: string
  className?: string
  itemClassName?: string
  defaultValue?: string
  value?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export function Radio({
  options,
  label,
  name,
  orientation = "vertical",
  classContainer,
  classLabel,
  className,
  itemClassName,
  defaultValue,
  value,
  disabled = false,
  onValueChange,
}: RadioProps) {
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
        <Label className={cn("w-fit leading-4", classLabel)}>{label}</Label>
      )}
      <RadioGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        className={cn(
          "flex gap-4",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className,
        )}
      >
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={`${name ? `${name}_${option.value}` : option.value}`}
            className={cn(
              "flex cursor-pointer items-center space-x-2",
              disabled && "cursor-not-allowed opacity-80",
            )}
          >
            <RadioGroupItem
              value={option.value}
              id={`${name ? `${name}_${option.value}` : option.value}`}
              disabled={disabled}
              className={itemClassName}
            />
            <span className="text-sm">{option.label}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
