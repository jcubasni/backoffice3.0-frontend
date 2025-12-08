import { useEffect } from "react"
import { useController, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { ComboSearch, ComboSearchProps } from "../ui/combo-search"

interface ComboSearchFormProps
  extends Omit<ComboSearchProps, "name" | "onSelect" | "value"> {
  name: string
  label?: string
  onSelect?: (value: string) => void
  onSearch?: (searchTerm: string) => void
  onDeselect?: () => void
}

export function ComboSearchForm({
  name,
  label,
  classLabel,
  className,
  classContainer,
  defaultValue,
  onSelect,
  onSearch,
  onDeselect,
  options,
  search,
  ...props
}: ComboSearchFormProps) {
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

  const handleDeselect = () => {
    onChange("")
    if (onDeselect) {
      onDeselect()
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
    <ComboSearch
      {...props}
      {...fieldProps}
      value={value}
      onSelect={handleSelect}
      onSearch={onSearch}
      onDeselect={handleDeselect}
      label={label}
      name={name}
      classLabel={cn(classLabel, invalid && "text-red-400")}
      className={cn(className, invalid && "border-red-400")}
      classContainer={cn(
        classContainer,
        invalid && "transition-colors duration-300",
      )}
      options={options}
      search={search}
    />
  )
}
