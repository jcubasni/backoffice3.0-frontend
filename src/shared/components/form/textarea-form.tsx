import { Path, useController, useFormContext } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Textarea, TextareaProps } from "../ui/textarea"

interface TextareaFormProps<T extends z.ZodObject<z.ZodRawShape>>
  extends Omit<TextareaProps, "name"> {
  schema?: T
  name: Path<z.infer<T>>
  label?: string
}

export function TextareaForm<T extends z.ZodObject<z.ZodRawShape>>({
  label,
  name,
  className,
  classLabel,
  classContainer,
  onChange,
  ...props
}: TextareaFormProps<T>) {
  const { register, control, setValue, trigger } = useFormContext<z.infer<T>>()
  const {
    fieldState: { invalid },
  } = useController({
    control,
    name,
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(name, e.target.value as any, { shouldValidate: true })
    trigger(name)
    onChange?.(e)
  }

  return (
    <Textarea
      {...register(name)}
      {...props}
      onChange={handleChange}
      label={label}
      classLabel={cn(classLabel, invalid && "text-red-400")}
      className={cn(className, invalid && "border-red-400")}
      classContainer={cn(
        classContainer,
        invalid && "transition-colors duration-300",
      )}
    />
  )
}
