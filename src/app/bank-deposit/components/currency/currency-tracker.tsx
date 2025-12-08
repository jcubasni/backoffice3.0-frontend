import { CoinsIcon, Wallet } from "lucide-react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { bills, coins, extractQuantities } from "../../lib/currency"
import {
  CurrencyEntry,
  CurrencyQuantities,
  ECurrencyEntry,
} from "../../types/currency.type"
import { CurrencySection } from "./currency-section"

export interface CurrencyTrackerProps {
  initialData?: CurrencyEntry[]
  onChange?: (data: CurrencyEntry[], total: number) => void
  readonly?: boolean
}

export default function CurrencyTracker({
  initialData,
  onChange,
  readonly = false,
}: CurrencyTrackerProps) {
  const [coinQuantities, setCoinQuantities] = useState<CurrencyQuantities>(
    () => ({
      ...Object.fromEntries(coins.map((c) => [c.value, 0])),
      ...extractQuantities(initialData, "MONEDA"),
    }),
  )

  const [billQuantities, setBillQuantities] = useState<CurrencyQuantities>(
    () => ({
      ...Object.fromEntries(bills.map((b) => [b.value, 0])),
      ...extractQuantities(initialData, "BILLETE"),
    }),
  )

  useEffect(() => {
    if (initialData) {
      setCoinQuantities(() => ({
        ...Object.fromEntries(coins.map((c) => [c.value, 0])),
        ...extractQuantities(initialData, "MONEDA"),
      }))
      setBillQuantities(() => ({
        ...Object.fromEntries(bills.map((b) => [b.value, 0])),
        ...extractQuantities(initialData, "BILLETE"),
      }))
    }
  }, [initialData])

  useEffect(() => {
    const coinEntries: CurrencyEntry[] = coins
      .map((c) => ({
        denomination: c.value,
        quantity: coinQuantities[c.value] || 0,
        total: c.value * (coinQuantities[c.value] || 0),
        type: ECurrencyEntry.MONEDA,
      }))
      .filter((item) => item.quantity > 0)

    const billEntries: CurrencyEntry[] = bills
      .map((b) => ({
        denomination: b.value,
        quantity: billQuantities[b.value] || 0,
        total: b.value * (billQuantities[b.value] || 0),
        type: ECurrencyEntry.BILLETE,
      }))
      .filter((item) => item.quantity > 0)

    const combined = [...coinEntries, ...billEntries]
    const total = combined.reduce((sum, item) => sum + (item.total ?? 0), 0)

    onChange?.(combined, total)
  }, [coinQuantities, billQuantities])

  return (
    <Tabs defaultValue="coins">
      <TabsList className="w-full">
        <TabsTrigger value="coins" className="flex items-center gap-1">
          <CoinsIcon />
          Monedas
        </TabsTrigger>
        <TabsTrigger value="bills" className="flex items-center gap-1">
          <Wallet />
          Billetes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="coins">
        <CurrencySection
          title="Coins"
          icon={<CoinsIcon className="size-4" />}
          symbol="S/"
          items={coins}
          quantities={coinQuantities}
          onChange={(value, quantity) =>
            setCoinQuantities((prev) => ({ ...prev, [value]: quantity }))
          }
          isCoin
          readOnly={readonly}
        />
      </TabsContent>

      <TabsContent value="bills">
        <CurrencySection
          title="Bills"
          icon={<Wallet className="size-4" />}
          symbol="S/"
          items={bills}
          quantities={billQuantities}
          onChange={(value, quantity) =>
            setBillQuantities((prev) => ({ ...prev, [value]: quantity }))
          }
          readOnly={readonly}
        />
      </TabsContent>
    </Tabs>
  )
}
