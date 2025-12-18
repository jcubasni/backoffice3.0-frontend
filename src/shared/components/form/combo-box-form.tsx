// combo-box-form.tsx
import { useController, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { ComboBox, ComboBoxProps } from "../ui/combo-box"

interface ComboBoxFormProps
  extends Omit<ComboBoxProps, "name" | "onSelect" | "value"> {
  name: string
  label?: string
  onSelect?: (value: string) => void
}

export function ComboBoxForm({
  name,
  label,
  classLabel,
  className,
  classContainer,
  onSelect,
  options,
  ...props
}: ComboBoxFormProps) {
  const { control } = useFormContext()

  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { invalid },
  } = useController({ control, name })

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    onSelect?.(selectedValue)
  }

  return (
    <ComboBox
      {...props}
      {...fieldProps}
      value={value ?? ""}  // ✅ CONTROLADO por RHF
      onSelect={handleSelect}
      label={label}
      name={name}
      classLabel={cn(classLabel, invalid && "text-red-400")}
      className={cn(className, invalid && "border-red-400")}
      classContainer={cn(
        classContainer,
        invalid && "transition-colors duration-300",
      )}
      options={options}
    />
  )
}
