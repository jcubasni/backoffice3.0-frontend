import { useEffect } from "react"
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
  defaultValue,
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
    if (onSelect) {
      onSelect(selectedValue)
    }
  }

  useEffect(() => {
    if (defaultValue) {
      onChange(defaultValue)
    } else if (
      options &&
      options.length > 0 &&
      value &&
      !options.find((option) => option.value === value)
    ) {
      // Solo limpiar el valor si las opciones están completamente cargadas
      // y después de un breve delay para evitar limpiar valores válidos durante la carga inicial
      const timeoutId = setTimeout(() => {
        if (!options.find((option) => option.value === value)) {
          onChange(undefined)
        }
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [defaultValue, options, value, onChange])

  return (
    <ComboBox
      {...props}
      {...fieldProps}
      defaultValue={value}
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
