import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Input } from "@/shared/components/ui/input"
import { formatCurrency } from "@/shared/lib/number"

interface CurrencyInputProps {
  id: string
  label: string
  value: number
  total: number
  decimalPlaces?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
}

export function CurrencyInput({
  id,
  label,
  value,
  total,
  decimalPlaces = 0,
  onChange,
  readOnly,
}: CurrencyInputProps) {
  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-1 text-xs">
        {label}
      </Label>
      <div className="flex items-center justify-between gap-2 pr-6">
        <Input
          name={id}
          type="number"
          min="0"
          value={value || ""}
          onChange={readOnly ? undefined : onChange}
          className="h-7 w-16 text-xs"
          readOnly={readOnly}
        />
        <Badge
          variant="secondary"
          className={cn("text-muted-foreground text-sm")}
        >
          {formatCurrency(total.toFixed(decimalPlaces))}
        </Badge>
      </div>
    </div>
  )
}
