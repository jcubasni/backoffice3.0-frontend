import Big from "big.js"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useGetPaymentCards } from "@/app/sales/hooks/sale/payment/usePaymentService"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { useProductStore } from "@/app/sales/store/product.store"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { InputForm } from "@/shared/components/form/input-form"

export default function CardOption({ index }: { index: number }) {
  const { data } = useGetPaymentCards()
  const totalRaw = useProductStore.getState().totals.totalToPay
  const total = Number(totalRaw.toFixed(2))
  const { setValue, getValues } = useFormContext<SaleSchema>()

  // Inicializar con el monto faltante al cargar el componente
  useEffect(() => {
    const currentAmount = getValues(`payments.${index}.amountToCollect`)

    // Solo establecer el valor si aún no tiene uno (es 0 o undefined)
    if (!currentAmount || currentAmount === 0) {
      const totalAmounts = getValues("payments").reduce((acc, field, idx) => {
        if (idx === index) return acc // No incluir el pago actual en el cálculo
        const amountToCollect = new Big(field.amountToCollect || 0)
        return acc.plus(amountToCollect)
      }, new Big(0))

      const totalBig = new Big(total)
      const remainingAmount = totalBig.minus(totalAmounts)

      if (remainingAmount.gt(0)) {
        setValue(`payments.${index}.amountToCollect`, Number(remainingAmount.toFixed(2)))
      }
    }
  }, [])

  const handleChangeTotal = (value: number | string) => {
    const totalCardByIndex = new Big(
      getValues(`payments.${index}.amountToCollect`) || 0,
    )
    const totalAmounts = getValues("payments").reduce((acc, field) => {
      const amountToCollect = new Big(field.amountToCollect || 0)
      return acc.plus(amountToCollect)
    }, new Big(0))

    if (Number(value) <= 0) return

    // Redondear el valor de entrada a 2 decimales
    const valueBig = new Big(Number(value).toFixed(2))
    const totalWithoutValue = totalAmounts.minus(totalCardByIndex)
    const allegedTotal = totalWithoutValue.plus(valueBig)
    const totalBig = new Big(total)

    if (allegedTotal.lt(totalBig)) {
      setValue(`payments.${index}.amountToCollect`, Number(valueBig.toFixed(2)))
      return
    }
    setValue(`payments.${index}.amountToCollect`, Number(totalBig.minus(totalWithoutValue).toFixed(2)))
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <ComboBoxForm
        name={`payments.${index}.cardTypeCode`}
        options={data ?? []}
        label="Tipo"
        className="w-full! min-w-20"
        placeholder="Tipo"
      />
      <InputForm
        label={"N° de referencia S/"}
        name={`payments.${index}.referenceDocument`}
        classContainer="flex-1"
      />
      <InputForm
        label={"Monto"}
        name={`payments.${index}.amountToCollect`}
        type="number"
        step="0.01"
        classContainer="flex-1"
        onChange={(e) => {
          const value = e.target.value
          if (value && !Number.isNaN(Number(value))) {
            const rounded = Number(Number(value).toFixed(2))
            setValue(`payments.${index}.amountToCollect`, rounded, { shouldValidate: false })
          }
        }}
        onBlur={(e) => handleChangeTotal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleChangeTotal(e.currentTarget.value)
          }
        }}
      />
    </div>
  )
}
