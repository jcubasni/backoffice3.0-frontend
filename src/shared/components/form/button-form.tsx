import { ClipLoader } from "react-spinners"
import { Button, type ButtonProps } from "@/components/ui/button"

interface ButtonFormProps extends ButtonProps {
  text: string
  isPending?: boolean
}

export function ButtonForm({
  text,
  isPending = false,
  ...props
}: ButtonFormProps) {
  return (
    <Button disabled={isPending} {...props}>
      {isPending ? (
        <ClipLoader size={16} color="hsl(var(--primary-foreground))" />
      ) : (
        text
      )}
    </Button>
  )
}
