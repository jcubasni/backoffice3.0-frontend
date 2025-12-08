import { X } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"
import { useGetPaymentMethods } from "@/app/sales/hooks/sale/payment/usePaymentService"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { dataToCombo } from "@/shared/lib/combo-box"
import { PaymentComponents } from "./payment-methods"

export default function PaymentForm({
  index,
  remove,
}: {
  index: number
  remove: (index: number) => void
}) {
  const { setValue, getValues, control } = useFormContext<SaleSchema>()
  const codeComponent = useWatch({
    control,
    name: `payments.${index}.componentId`,
  })
  const { data } = useGetPaymentMethods()

  const PaymentComponent = PaymentComponents[codeComponent]?.component
  const handleComboChange = (value: string) => {
    const componentId =
      data?.find((payment) => payment.paymentCode === value)?.codeComponent ??
      "EMPTY"
    setValue(`payments.${index}.componentId`, componentId)
  }
  return (
    <main className="flex flex-col gap-2.5">
      <header className="flex justify-between">
        <div className="flex items-end gap-2">
          <h2 className="text-[#1B4981] text-base leading-5">
            PAGO {index + 1}
          </h2>
          <p className="text-sm leading-4">Seleccionar tipo de pago</p>
        </div>
        <X
          className="h-5 w-5"
          onClick={() => {
            if (getValues("payments").length === 1) return
            remove(index)
          }}
        />
      </header>
      <ComboBoxForm
        name={`payments.${index}.paymentMethodId`}
        options={dataToCombo(data, "paymentCode", "name")}
        onSelect={handleComboChange}
        className="w-full!"
      />
      {PaymentComponent && <PaymentComponent index={index} />}
    </main>
  )
}
