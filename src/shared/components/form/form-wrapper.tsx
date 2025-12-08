import {
  FieldErrors,
  FieldValues,
  FormProvider,
  UseFormReturn,
} from "react-hook-form"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getFirstError } from "@/shared/lib/error"

interface FormWrapperProps<T extends FieldValues = any>
  extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  form: UseFormReturn<T>
  children: React.ReactNode
  onSubmit: (data: T) => void | Promise<void>
}

export function FormWrapper<T extends FieldValues = any>({
  form,
  children,
  className,
  onKeyDown,
  onSubmit,
  ...props
}: FormWrapperProps<T>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  const handleError = (e: FieldErrors) => {
    console.log(e)
    const error = getFirstError(e)
    toast.error(error.error)
  }

  return (
    <FormProvider {...form}>
      <form
        {...props}
        className={cn("flex flex-col gap-2 h-full ", className)}
        onKeyDown={handleKeyDown}
        onSubmit={form.handleSubmit(onSubmit, handleError)}
      >
        {children}
      </form>
    </FormProvider>
  )
}
