import { format } from "date-fns"
import { useController, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { DatePicker, DatePickerProps } from "../ui/date-picker"

interface DatePickerFormProps extends DatePickerProps {
  name: string
}

export function DatePickerForm({
  name,
  className,
  classLabel,
  classContainer,
  disabled,
  defaultValue,
  ...props
}: DatePickerFormProps) {
  const { control } = useFormContext()
  const {
    field,
    fieldState: { invalid },
  } = useController({
    control,
    name,
    defaultValue,
  })

  // Convert field value to string format for DatePicker using date-fns
  const fieldValue = field.value
    ? field.value instanceof Date
      ? format(field.value, "yyyy-MM-dd")
      : field.value
    : undefined

  return (
    <DatePicker
      className={cn(className, invalid && "border-red-400")}
      classLabel={cn(classLabel, invalid && "text-red-400")}
      classContainer={cn(classContainer, "transition-colors duration-300")}
      onSelect={field.onChange}
      defaultValue={fieldValue}
      disabled={disabled}
      {...props}
    />
  )
}
