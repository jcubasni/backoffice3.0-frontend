import { Path, useController, useFormContext } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Input, InputProps } from "../ui/input"

interface InputFormProps<T extends z.ZodObject<z.ZodRawShape>>
  extends Omit<InputProps, "name"> {
  schema?: T
  name: Path<z.infer<T>>
  label?: string
}

export function InputForm<T extends z.ZodObject<z.ZodRawShape>>({
  orientation = "vertical",
  label,
  name,
  classLabel,
  className,
  classButton,
  classContainer,
  classIcon,
  onChange,
  ...props
}: InputFormProps<T>) {
  const { register, control, setValue, trigger } = useFormContext<z.infer<T>>()
  const {
    fieldState: { invalid },
  } = useController({
    control,
    name,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.value as any, { shouldValidate: true })
    trigger(name)
    onChange?.(e)
  }

  return (
    <Input
      {...register(name)}
      {...props}
      onChange={handleChange}
      label={label}
      name={name}
      classLabel={cn(classLabel, invalid && "text-red-400")}
      className={cn(className, invalid && "border-red-400")}
      classButton={cn(classButton, invalid && "border-red-400")}
      classIcon={cn(classIcon, invalid && "text-red-400")}
      classContainer={cn(
        classContainer,
        invalid && "transition-colors duration-300",
      )}
    />
  )
}
