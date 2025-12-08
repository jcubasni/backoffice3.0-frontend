import Big from "big.js"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useShallow } from "zustand/react/shallow"
import { useSaleHelpers } from "@/app/sales/hooks/sale/useSale.helper"
import { useSaleSubmit } from "@/app/sales/hooks/sale/useSaleSubmit"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { useClientUtilStore } from "@/app/sales/store/client-util.store"
import { useProductStore } from "@/app/sales/store/product.store"
import { idAdvanceProduct, RetentionPercentage } from "@/app/sales/types/sale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonForm } from "@/shared/components/form/button-form"
import { DECIMAL_PLACES } from "@/shared/lib/constans"
import { formatCurrency } from "@/shared/lib/number"

interface TotalsProps {
  isPending: boolean
}

export const Totals = ({ isPending }: TotalsProps) => {
  const form = useFormContext<SaleSchema>()
  const { reset, clearErrors } = form
  const sale = useSaleSubmit({ form })
  const { isRetention, isFreeTransaction } = useSaleHelpers()
  const totals = useProductStore((state) => state.totals)
  const products = useProductStore((state) => state.products)
  const setDerivedTotals = useProductStore((state) => state.setDerivedTotals)
  const resetProduct = useProductStore((state) => state.resetProduct)
  const {
    resetClientUtil,
    selectedClientData,
    documentTypeId,
    paymentType,
    accountBalance,
  } = useClientUtilStore(
    useShallow((state) => ({
      resetClientUtil: state.resetClientUtil,
      selectedClientData: state.selectedClientData,
      documentTypeId: state.documentTypeId,
      paymentType: state.paymentType,
      accountBalance: state.accountBalance,
    })),
  )

  useEffect(() => {
    // Si hay detracción, no puede haber retención
    const hasDetraction = totals.detraction > 0
    const retentionAmount =
      isRetention() && !hasDetraction
        ? Number(
            new Big(totals.subtotal)
              .times(RetentionPercentage)
              .div(100)
              .toFixed(DECIMAL_PLACES),
          )
        : 0

    const advanceAmount = products
      .filter((product) => product.productId === idAdvanceProduct)
      .reduce((acc, product) => acc + (product.total ?? 0), 0)

    const baseTotalToPay = Number(
      new Big(totals.total)
        .minus(retentionAmount)
        .minus(totals.detraction)
        .toFixed(DECIMAL_PLACES),
    )

    const finalAdvanceDeduction = Math.min(advanceAmount, baseTotalToPay)

    const totalToPay = isFreeTransaction()
      ? 0
      : Number(
          new Big(baseTotalToPay)
            .minus(finalAdvanceDeduction)
            .toFixed(DECIMAL_PLACES),
        )
    if (
      retentionAmount !== totals.retentionAmount ||
      totalToPay !== totals.totalToPay
    ) {
      setDerivedTotals(retentionAmount, totalToPay)
    }
  }, [
    totals,
    selectedClientData,
    setDerivedTotals,
    products,
    documentTypeId,
    paymentType,
  ])

  const handleCancel = () => {
    resetProduct()
    resetClientUtil()
    reset()
    clearErrors()
  }

  const totalItems = [
    { label: "Retención", value: totals.retentionAmount ?? 0 },
    { label: "Detracción", value: totals.detraction ?? 0 },
    { label: "Subtotal", value: totals.subtotal },
    { label: "IGV", value: totals.igv },
    { label: "Total", value: totals.total },
    { label: "Total a pagar", value: totals.totalToPay ?? 0 },
  ]

  return (
    <footer className="flex w-full flex-col gap-4 md:grid md:grid-cols-9 md:items-end">
      <div className="col-span-7 flex flex-wrap items-center gap-3">
        {accountBalance !== undefined && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">
              Saldo crédito:
            </span>
            <Badge variant="secondary" className="px-3 py-1.5 text-sm">
              {formatCurrency(accountBalance)}
            </Badge>
          </div>
        )}
        {totalItems.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">{item.label}:</span>
            <Badge variant="outline" className="px-3 py-1.5 text-sm">
              {formatCurrency(item.value)}
            </Badge>
          </div>
        ))}
      </div>
      <div className="col-span-2 flex justify-end gap-4 [&_button]:max-w-32 [&_button]:flex-1">
        <Button type="button" onClick={handleCancel} disabled={isPending}>
          Cancelar
        </Button>
        <ButtonForm isPending={isPending} text="Pagar" />
        <Button variant={"outline"} onClick={sale}>
          Pagar
        </Button>
      </div>
    </footer>
  )
}
