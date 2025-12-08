import { useController, useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface Option {
  label: string
  value: string
}

interface RadioFormProps {
  name: string
  options: Option[]
  label?: string
  orientation?: "horizontal" | "vertical"
  classContainer?: string
  classLabel?: string
  className?: string
  itemClassName?: string
  onValueChange?: (value: string) => void
}

export function RadioForm({
  name,
  options,
  label,
  orientation = "vertical",
  classContainer,
  classLabel,
  className,
  itemClassName,
  onValueChange,
}: RadioFormProps) {
  const { control, setValue } = useFormContext()
  const {
    field: { value },
    fieldState: { invalid },
  } = useController({
    control,
    name,
  })

  const onChange = (value: string) => {
    setValue(name, value)
    onValueChange?.(value)
  }

  return (
    <div
      className={cn(
        "flex gap-2 text-sm",
        orientation === "vertical"
          ? "flex-col"
          : "items-center justify-center gap-4",
        classContainer,
        invalid && "transition-colors duration-300",
      )}
    >
      {label && (
        <Label
          className={cn(
            "w-fit leading-4",
            classLabel,
            invalid && "text-red-400",
          )}
        >
          {label}
        </Label>
      )}
      <RadioGroup
        defaultValue={value}
        onValueChange={onChange}
        className={cn(className, invalid && "border-red-400")}
      >
        {options.map((option, i) => (
          <label key={i} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              className={itemClassName}
              aria-invalid={invalid}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
