import Big from "big.js"
import { useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useGetCurrencies } from "@/app/configurations/currencies/hooks/useCurrenciesService"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { useProductStore } from "@/app/sales/store/product.store"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { InputForm } from "@/shared/components/form/input-form"
import { Input } from "@/shared/components/ui/input"
import { dataToCombo } from "@/shared/lib/combo-box"

export default function CashOption({ index }: { index: number }) {
  const currencies = useGetCurrencies()
  const totalRaw = useProductStore.getState().totals.totalToPay
  const total = Number(totalRaw.toFixed(2))

  const { setValue, getValues, control } = useFormContext<SaleSchema>()
  const amountToCollect = useWatch({
    control,
    name: `payments.${index}.amountToCollect`,
  })
  const TASA_CAMBIO = 3.65
  const handleChangeTotal = (value: number) => {
    const totalCashByIndex = new Big(
      getValues(`payments.${index}.amountToCollect`) || 0,
    )
    const totalAmounts = getValues("payments").reduce((acc, field) => {
      const amountToCollect = new Big(field.amountToCollect || 0)
      return acc.plus(amountToCollect)
    }, new Big(0))

    if (value <= 0) return

    // Redondear el valor de entrada a 2 decimales
    const valueBig = new Big(Number(value).toFixed(2))
    const totalWithoutValue = totalAmounts.minus(totalCashByIndex)
    const allegedTotal = totalWithoutValue.plus(valueBig)
    const totalBig = new Big(total)

    if (allegedTotal.lt(totalBig)) {
      setValue(`payments.${index}.amountToCollect`, Number(valueBig.toFixed(2)))
      return
    }
    setValue(`payments.${index}.amountToCollect`, Number(totalBig.minus(totalWithoutValue).toFixed(2)))
  }

  const listCurrency = useMemo(() => {
    return dataToCombo(currencies.data, "idCurrency", "simpleDescription")
  }, [])
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-primary-darker text-sm">
        Tasa de cambio: s/ <strong>{TASA_CAMBIO}</strong>
      </span>
      <div className="grid grid-cols-3 gap-2">
        <ComboBoxForm
          name={`payments.${index}.currencyId`}
          options={listCurrency}
          defaultValue={listCurrency[0].value}
          label="Divisa"
          className="w-full! min-w-20"
        />
        <InputForm
          label={"Recibido S/"}
          name={`payments.${index}.received`}
          type="number"
          step="0.01"
          onChange={(e) => {
            const value = e.target.value
            if (value && !Number.isNaN(Number(value))) {
              const rounded = Number(Number(value).toFixed(2))
              setValue(`payments.${index}.received`, rounded, { shouldValidate: false })
            }
          }}
          onBlur={(e) => handleChangeTotal(Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleChangeTotal(Number(e.currentTarget.value))
            }
          }}
        />
        <Input
          label="Total S/"
          value={Number(amountToCollect || 0).toFixed(2)}
          readOnly
        />
      </div>
    </div>
  )
}
