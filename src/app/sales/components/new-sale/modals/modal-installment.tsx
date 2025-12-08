import Big from "big.js"
import { addDays, format } from "date-fns"
import { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { useClientUtilStore } from "@/app/sales/store/client-util.store"
import { useProductStore } from "@/app/sales/store/product.store"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { parseLocalDate } from "@/shared/lib/date"
import { useModalStore } from "@/shared/store/modal.store"

type InstallmentData = {
  dueDate: Date
  amount: number
}

export default function ModalInstallment() {
  const form = useFormContext<SaleSchema>()
  const { control, setValue } = form
  const creditInfo = useClientUtilStore((state) => state.creditInfo)
  const totals = useProductStore((state) => state.totals)
  const {
    creditDays,
    endDate,
    installments: maxInstallments,
  } = creditInfo || {}

  const [installmentCount, emisionDate] = useWatch({
    control,
    name: ["creditInvoiceInfo.installmentCount", "emisionDate"],
  })

  // Calcular las fechas y montos de vencimiento de las cuotas
  const installmentData = useMemo((): InstallmentData[] => {
    if (!emisionDate || !creditDays || !installmentCount || !totals.totalToPay)
      return []

    const endDateParsed = parseLocalDate(endDate)
    const data: InstallmentData[] = []

    // Calcular monto base por cuota
    const totalToPayBig = new Big(totals.totalToPay)
    const installmentCountBig = new Big(installmentCount)
    const baseAmount = totalToPayBig.div(installmentCountBig)
    const baseAmountRounded = Number(baseAmount.toFixed(2))

    // Calcular la suma de todas las cuotas con el monto base
    const totalWithBaseAmount = new Big(baseAmountRounded).times(
      installmentCountBig,
    )
    const difference = totalToPayBig.minus(totalWithBaseAmount)

    for (let i = 1; i <= installmentCount; i++) {
      // Fecha calculada: emisión + (creditDays * número de cuota)
      let dueDate = addDays(emisionDate, creditDays * i)

      // Si la fecha calculada excede endDate, limitarla a endDate
      if (endDateParsed && dueDate > endDateParsed) {
        dueDate = endDateParsed
      }

      // Calcular monto: si es la última cuota, ajustar con la diferencia
      let amount = baseAmountRounded
      if (i === installmentCount) {
        amount = Number(new Big(baseAmountRounded).plus(difference).toFixed(2))
      }

      data.push({ dueDate, amount })
    }

    return data
  }, [emisionDate, creditDays, installmentCount, endDate, totals.totalToPay])

  // Calcular período de inicio y fin automáticamente
  useEffect(() => {
    if (installmentData.length > 0) {
      const periodStart = emisionDate || new Date()
      const periodEnd = installmentData[installmentData.length - 1].dueDate

      setValue("creditInvoiceInfo.periodStart", periodStart)
      setValue("creditInvoiceInfo.periodEnd", periodEnd)
    }
  }, [installmentData, emisionDate, setValue])

  useEffect(() => {
    setValue("creditInvoiceInfo.installmentCount", 1)
  }, [setValue])

  const handleCancel = () => {
    setValue("creditInvoiceInfo.installmentCount", 0)
    useModalStore.getState().closeModal("modal-installment")
  }

  const handleGuardar = () => {
    form.handleSubmit(() => {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      })
      const formElement = document.querySelector("form")
      if (formElement) {
        formElement.dispatchEvent(submitEvent)
      }
    })()
  }

  // Calcular el total de todas las cuotas para verificar
  const totalInstallments = useMemo(() => {
    return installmentData.reduce((sum, item) => {
      return Number(new Big(sum).plus(item.amount).toFixed(2))
    }, 0)
  }, [installmentData])

  return (
    <Modal
      modalId="modal-installment"
      title="Términos de pago"
      className="sm:w-[600px]"
      scrollable={true}
      onClose={handleCancel}
    >
      <div className="space-y-4">
        <InputForm
          name="creditInvoiceInfo.installmentCount"
          label="Número de cuotas"
          type="number"
          min={1}
          max={maxInstallments}
        />

        {creditDays && (
          <div className="rounded-md border p-3">
            <Label className="font-semibold text-sm">
              Información de crédito
            </Label>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Días de crédito:</span>{" "}
                {creditDays} días
              </p>
              <p>
                <span className="text-muted-foreground">
                  Fecha límite de contrato:
                </span>{" "}
                {endDate
                  ? format(parseLocalDate(endDate)!, "dd/MM/yyyy")
                  : "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Total a pagar:</span> S/{" "}
                {totals.totalToPay.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {installmentData.length > 0 && (
          <div className="rounded-md border p-3">
            <Label className="font-semibold text-sm">Detalle de cuotas</Label>
            <div className="mt-2 max-h-60 space-y-2 overflow-y-auto">
              {installmentData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm"
                >
                  <div className="flex-1">
                    <span className="font-medium">Cuota {index + 1}:</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-muted-foreground">
                      {format(item.dueDate, "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="font-semibold">
                      S/ {item.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="t-3 flex items-center justify-between border-t pt-2 font-semibold text-sm">
              <span>Total:</span>
              <span>S/ {totalInstallments.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <Modal.Footer className="grid-cols-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
