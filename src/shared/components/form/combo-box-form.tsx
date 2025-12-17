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

  const normalize = (v: unknown) => (v === null || v === undefined ? "" : String(v))

  const handleSelect = (selectedValue: unknown) => {
    const next = normalize(selectedValue)
    onChange(next)
    onSelect?.(next)
  }

  useEffect(() => {
    // ✅ set defaultValue
    if (defaultValue !== undefined && defaultValue !== null) {
      onChange(normalize(defaultValue))
      return
    }

    // ✅ si el value actual no existe en options (cuando ya cargaron), limpiar
    const current = normalize(value)
    if (!current) return
    if (!options || options.length === 0) return

    const exists = options.some((opt) => normalize(opt.value) === current)
    if (!exists) {
      const timeoutId = setTimeout(() => {
        const stillExists = options.some((opt) => normalize(opt.value) === current)
        if (!stillExists) onChange("") // 👈 mejor "" que undefined
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [defaultValue, options, value, onChange])

  return (
    <ComboBox
      {...props}
      {...fieldProps}
      defaultValue={normalize(value)} // 👈 lo que uses en tu ComboBox actual
      onSelect={handleSelect}
      label={label}
      name={name}
      classLabel={cn(classLabel, invalid && "text-red-400")}
      className={cn(className, invalid && "border-red-400")}
      classContainer={cn(classContainer, invalid && "transition-colors duration-300")}
      options={options}
    />
  )
}
