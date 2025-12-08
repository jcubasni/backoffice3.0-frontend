import Big from "big.js"
import { Plus } from "lucide-react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { useSaleHelpers } from "@/app/sales/hooks/sale/useSale.helper"
import { Modals } from "@/app/sales/lib/sale/sale-modals-name"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { useProductStore } from "@/app/sales/store/product.store"
import { CodeComponentE } from "@/app/sales/types/payment"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import PaymentForm from "../payments/payment-form"

export default function ModalPayment() {
  const processSale = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === Modals.PAYMENT,
  )?.prop as (payments: SaleSchema["payments"]) => void
  const form = useFormContext<SaleSchema>()
  const { control, resetField } = form
  const { totals } = useProductStore()
  const { isRetention } = useSaleHelpers()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  })

  const payments = useWatch({ control, name: "payments" })

  const totalPayments = Number(
    payments
      ?.reduce((sum, payment) => {
        const amount = new Big(payment.amountToCollect || 0)
        return sum.plus(amount)
      }, new Big(0))
      .toFixed(2) || 0,
  )

  // Calcular el vuelto basado en pagos en efectivo
  const changeAmount =
    payments?.reduce((sum, payment) => {
      if (payment.componentId === "CP001") {
        const received = new Big(payment.received || 0)
        const amountToCollect = new Big(payment.amountToCollect || 0)
        const change = received.minus(amountToCollect)
        return sum.plus(change.gt(0) ? change : 0)
      }
      return sum
    }, new Big(0)) || new Big(0)

  const maxAllowedAmount = Number(totals.totalToPay.toFixed(2))
  const totalPaymentsBig = new Big(totalPayments)
  const maxAllowedBig = new Big(maxAllowedAmount)
  const hasExcessPayment = totalPaymentsBig.gt(maxAllowedBig)

  // Verificar si hay pagos en efectivo cuando es retención (solo si el monto de retención > 0)
  const hasCashPaymentInRetention =
    isRetention() &&
    totals.retentionAmount > 0 &&
    payments?.some(
      (payment) =>
        payment.componentId === "CP001" || payment.paymentMethodId === "00001",
    )

  const handleAddPayment = () => {
    append({
      paymentMethodId: "",
      componentId: CodeComponentE.EMPTY,
      amountToCollect: 0,
    })
  }

  const handleClose = () => {
    resetField("payments")
    resetField("creditInvoiceInfo")
    useModalStore.getState().closeModal("modal-payment")
  }

  return (
    <Modal
      modalId="modal-payment"
      title="Pagos"
      className="sm:w-[500px]"
      onClose={handleClose}
    >
      <div className="space-y-4">
        {fields.map((field, index) => (
          <PaymentForm key={field.id} index={index} remove={remove} />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddPayment}
          className="ml-auto flex w-fit items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Pago
        </Button>

        <Separator className="mb-2" />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Total"
            value={`S/. ${totals.totalToPay.toFixed(2)}`}
            readOnly
          />
          <Input
            label="Monto Acumulado"
            value={`S/. ${totalPayments.toFixed(2)}`}
            readOnly
            className={hasExcessPayment ? "border-red-500" : ""}
          />
          <Input
            label="Vuelto"
            value={`S/. ${changeAmount.toFixed(2)}`}
            readOnly
          />
        </div>

        {isRetention() && totals.retentionAmount > 0 && (
          <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
            <p className="text-orange-800 text-sm">
              <strong>Operación con Retención:</strong> El monto incluye la
              retención de S/. {totals.retentionAmount.toFixed(2)} descontada
              del total.
            </p>
          </div>
        )}

        {hasExcessPayment && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> El monto acumulado de pagos (S/.{" "}
              {totalPayments.toFixed(2)}) excede el total a pagar (S/.{" "}
              {maxAllowedAmount.toFixed(2)}).
            </p>
          </div>
        )}

        {hasCashPaymentInRetention && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> No se permite pagos en efectivo para
              operaciones con retención. Debe usar otro método de pago.
            </p>
          </div>
        )}
      </div>

      <Modal.Footer className="grid-cols-2">
        <Button type="button" variant="outline" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={() => processSale(form.getValues("payments"))}
          disabled={hasExcessPayment || hasCashPaymentInRetention}
        >
          Realizar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
