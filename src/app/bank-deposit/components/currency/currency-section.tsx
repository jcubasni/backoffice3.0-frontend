import { CurrencyQuantities } from "../../types/currency.type"
import { CurrencyInput } from "./currency-input"

interface CurrencySectionProps {
  title: string
  icon: React.ReactNode
  symbol: string
  items: { value: number; name: string }[]
  quantities: CurrencyQuantities
  onChange: (value: number, quantity: number) => void
  isCoin?: boolean
  readOnly?: boolean
}

export function CurrencySection({
  items,
  quantities,
  onChange,
  isCoin = false,
  readOnly = false,
}: CurrencySectionProps) {
  return (
    <div className="grid grid-cols-2 gap-2 px-2">
      {items.map((item) => (
        <CurrencyInput
          key={item.value}
          id={`${isCoin ? "coin" : "bill"}-${item.value}`}
          label={item.name}
          value={quantities[item.value] || 0}
          total={item.value * (quantities[item.value] || 0)}
          decimalPlaces={item.value < 1 ? 2 : 0}
          onChange={
            !readOnly
              ? (e) => {
                  const qty = parseInt(e.target.value) || 0
                  onChange(item.value, qty)
                }
              : () => {}
          }
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}
