import Big from "big.js"
import { addDays, differenceInDays, format } from "date-fns"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { useModalStore } from "@/shared/store/modal.store"
import { PaymentSchema } from "../../schemas/payment.schema"
import { SaleSchema } from "../../schemas/sale.schema"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import { PaymentMethodE } from "../../types/payment"
import {
  CodeComponentE,
  CurrencyE,
  PaymentDTO,
} from "../../types/payment/payment.type"
import { PaymentType } from "../../types/sale"

export const buildPaymentDTO = (payment: PaymentSchema): PaymentDTO => {
  const basePayment = {
    paymentCode: payment.paymentMethodId,
    amountToCollect: Number((payment.amountToCollect || 0).toFixed(2)),
  }

  switch (payment.componentId) {
    case CodeComponentE.CASH: // Cash
      console.log("payment", payment.currencyId, typeof payment.currencyId)
      return {
        ...basePayment,
        currencyId: Number(payment.currencyId),
        received: Number((payment.received || 0).toFixed(2)),
      }

    case CodeComponentE.CARD: // Card
      return {
        ...basePayment,
        cardTypeCode: payment.cardTypeCode,
        referenceDocument: payment.referenceDocument,
      }

    default:
      throw new Error(`Unsupported payment component: ${payment.componentId}`)
  }
}

export const buildPaymentsDTO = (payments: PaymentSchema[]): PaymentDTO[] => {
  return payments.map((payment) => buildPaymentDTO(payment))
}

export const shouldOpenPaymentModal = (
  data: FieldValues,
  form: UseFormReturn<SaleSchema>,
): boolean => {
  const { paymentType, documentTypeId } = useClientUtilStore.getState()
  const { totals } = useProductStore.getState()

  // No pedir pagos para nota de venta (documentTypeId === 3)
  const isSaleNote = documentTypeId === 3
  if (isSaleNote) {
    return true
  }

  // Evaluar si es CASH, totalToPay > 0 y payments está vacío
  if (
    paymentType === PaymentType.CASH &&
    totals.totalToPay > 0 &&
    (!data.payments || data.payments.length === 0)
  ) {
    // Setear el payment por defecto antes de abrir el modal
    const totalToPayRounded = Number(totals.totalToPay.toFixed(2))
    form.setValue("payments", [
      {
        componentId: CodeComponentE.CASH,
        paymentMethodId: PaymentMethodE.EFECTIVO,
        received: totalToPayRounded,
        amountToCollect: totalToPayRounded,
        currencyId: 1,
      },
    ])
    setTimeout(() => {
      useModalStore.getState().openModal("modal-payment")
    }, 0)
    return false
  }
  return true
}

interface InstallmentPlan {
  dueDate: string
  installmentNumber: number
  amount: number
}

export const calculateInstallmentPlan = (
  installmentCount: number,
  periodStart: Date,
  periodEnd: Date,
  totalAmount: number,
): InstallmentPlan[] => {
  if (installmentCount <= 0) {
    throw new Error("Installment count must be greater than 0")
  }

  if (periodStart >= periodEnd) {
    throw new Error("Period start must be before period end")
  }

  if (totalAmount <= 0) {
    throw new Error("Total amount must be greater than 0")
  }

  const totalBig = new Big(totalAmount)
  const installmentCountBig = new Big(installmentCount)
  const baseInstallmentAmount = totalBig.div(installmentCountBig)

  const totalDays = differenceInDays(periodEnd, periodStart)
  const daysBetweenInstallments = Math.floor(totalDays / installmentCount)

  const installmentPlan: InstallmentPlan[] = []
  let remainingAmount = totalBig

  for (let i = 1; i <= installmentCount; i++) {
    let installmentAmount: Big

    if (i === installmentCount) {
      // La última cuota lleva el monto restante para evitar errores de redondeo
      installmentAmount = remainingAmount
    } else {
      installmentAmount = baseInstallmentAmount
      remainingAmount = remainingAmount.minus(baseInstallmentAmount)
    }

    const dueDate = addDays(
      periodStart,
      (i - 1) * daysBetweenInstallments +
        (i === installmentCount ? totalDays : 0),
    )

    installmentPlan.push({
      dueDate: format(dueDate, "yyyy-MM-dd"),
      installmentNumber: i,
      amount: Number(installmentAmount.toFixed(2)),
    })
  }

  return installmentPlan
}

export const DefaultPayment = (totalToPay: number): PaymentSchema[] => {
  return [
    {
      componentId: CodeComponentE.CASH,
      paymentMethodId: PaymentMethodE.EFECTIVO,
      received: totalToPay,
      amountToCollect: totalToPay,
      currencyId: CurrencyE.PEN,
    },
  ]
}
