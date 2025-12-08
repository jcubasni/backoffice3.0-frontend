import type { Path } from "react-hook-form"
import { useController, useFormContext } from "react-hook-form"
import type { z } from "zod"
import { cn } from "@/lib/utils"
import { Checkbox, type CheckboxProps } from "../ui/checkbox"

interface CheckboxFormProps<T extends z.ZodObject<z.ZodRawShape>>
  extends Omit<CheckboxProps, "name"> {
  schema?: T
  name: Path<z.infer<T>>
  label?: string
}

export function CheckBoxForm<T extends z.ZodObject<z.ZodRawShape>>({
  label,
  name,
  classLabel,
  classContainer,
  className,
  ...props
}: CheckboxFormProps<T>) {
  const { control, setValue } = useFormContext<z.infer<T>>()
  const {
    field,
    fieldState: { invalid },
  } = useController({
    control,
    name,
  })

  const handleChange = (checked: boolean) => {
    setValue(name, checked as any, { shouldValidate: true })
  }

  return (
    <Checkbox
      {...props}
      label={label}
      name={name}
      checked={field.value}
      onCheckedChange={handleChange}
      classLabel={cn(classLabel, invalid && "text-red-400")}
      classContainer={cn(
        classContainer,
        invalid && "transition-colors duration-300",
      )}
      className={cn(className, invalid && "border-red-400")}
    />
  )
}
