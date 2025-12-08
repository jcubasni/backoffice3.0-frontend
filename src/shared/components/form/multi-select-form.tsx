import { useController, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { MultiSelect, MultiSelectProps } from "../ui/multi-select"

interface MultiSelectFormProps extends MultiSelectProps {
  name: string
}

export function MultiSelectForm({
  name,
  className,
  classLabel,
  options,
  defaultOptions,
  ...props
}: MultiSelectFormProps) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid },
  } = useController({
    control,
    name,
    // defaultValue: defaultOptions,
  })

  return (
    <MultiSelect
      options={options}
      className={cn(className, invalid && "border-red-400")}
      classLabel={cn(classLabel, invalid && "text-red-400")}
      defaultOptions={field.value || defaultOptions}
      onChange={field.onChange}
      {...props}
    />
  )
}
