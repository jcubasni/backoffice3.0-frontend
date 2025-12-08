import { useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useShallow } from "zustand/react/shallow"
import { useSaleHelpers } from "@/app/sales/hooks/sale/useSale.helper"
import { SaleSchema } from "@/app/sales/schemas/sale.schema"
import { useClientUtilStore } from "@/app/sales/store/client-util.store"
import { DatePickerForm } from "@/shared/components/form/date-picker-form"
import { parseLocalDate } from "@/shared/lib/date"

export const Dates = () => {
  const form = useFormContext<SaleSchema>()
  const {
    isCreditInvoice,
    isAdvance,
    isSaleNote,
    isInvoice,
    isTicket,
    isExcessTicket,
    isRetention,
  } = useSaleHelpers()
  const emissionDate = useWatch({ control: form.control, name: "emisionDate" })
  const { documentTypeId, paymentType, creditInfo } = useClientUtilStore(
    useShallow((state) => ({
      creditInfo: state.creditInfo,
      isFreeTransfer: state.isFreeTransfer,
      paymentType: state.paymentType,
      documentTypeId: state.documentTypeId,
    })),
  )

  const emissionLimits = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isSaleNote()) {
      return {
        min: undefined, // Sin límite hacia atrás
        max: today,
      }
    }

    if (isInvoice() || isTicket() || isExcessTicket()) {
      const threeDaysAgo = new Date(today)
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      return {
        min: threeDaysAgo,
        max: today,
      }
    }

    if (isCreditInvoice() && creditInfo && emissionDate) {
      const startDateCredit = parseLocalDate(creditInfo.startDateCredit)
      const endDateCredit = parseLocalDate(creditInfo.endDateCredit)

      // El mínimo es el mayor entre emissionDate y startDateCredit
      const minDate =
        startDateCredit && emissionDate > startDateCredit
          ? emissionDate
          : startDateCredit

      return {
        min: minDate,
        max: endDateCredit,
      }
    }

    return {
      min: undefined,
      max: today,
    }
  }, [documentTypeId, paymentType, creditInfo])

  const dueLimits = useMemo(() => {
    // Para comprobantes al contado o nota de venta: fecha de vencimiento = fecha de emisión
    if (
      isInvoice() ||
      isTicket() ||
      isExcessTicket() ||
      isRetention() ||
      isAdvance() ||
      isSaleNote()
    ) {
      return {
        min: emissionDate,
        max: emissionDate,
      }
    }

    // Para crédito: rango entre startDateCredit y endDateCredit
    // El mínimo es el mayor entre (emissionDate + 1 día) y startDateCredit
    if (isCreditInvoice() && creditInfo && emissionDate) {
      const startDateCredit = parseLocalDate(creditInfo.startDateCredit)
      const endDateCredit = parseLocalDate(creditInfo.endDateCredit)

      // emissionDate + 1 día
      const emissionDatePlusOne = new Date(emissionDate)
      emissionDatePlusOne.setDate(emissionDatePlusOne.getDate() + 1)

      // El mínimo es el mayor entre (emissionDate + 1 día) y startDateCredit
      const minDate =
        startDateCredit && emissionDatePlusOne < startDateCredit
          ? startDateCredit
          : emissionDatePlusOne

      return {
        min: minDate,
        max: endDateCredit,
      }
    }

    return {
      min: emissionDate,
      max: undefined,
    }
  }, [emissionDate, documentTypeId, paymentType, creditInfo])

  // Sincronizar fecha de vencimiento automáticamente
  useEffect(() => {
    if (!emissionDate) return

    // Para comprobantes al contado o nota de venta: fecha de vencimiento = fecha de emisión
    if (
      isInvoice() ||
      isTicket() ||
      isExcessTicket() ||
      isRetention() ||
      isAdvance() ||
      isSaleNote()
    ) {
      form.setValue("paymentDate", emissionDate)
      return
    }

    // Para créditos: fecha de vencimiento = mayor entre (emissionDate + 1 día) y startDateCredit
    if (isCreditInvoice() && creditInfo) {
      const startDateCredit = parseLocalDate(creditInfo.startDateCredit)

      // emissionDate + 1 día
      const emissionDatePlusOne = new Date(emissionDate)
      emissionDatePlusOne.setDate(emissionDatePlusOne.getDate() + 1)

      // El mínimo es el mayor entre (emissionDate + 1 día) y startDateCredit
      const minDate =
        startDateCredit && emissionDatePlusOne < startDateCredit
          ? startDateCredit
          : emissionDatePlusOne

      if (minDate) {
        form.setValue("paymentDate", minDate)
      }
    }
  }, [emissionDate, documentTypeId, paymentType, creditInfo])

  // Validar y ajustar fecha de emisión cuando cambia el tipo de documento
  useEffect(() => {
    if (!emissionDate) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Para facturas y boletas: validar que no exceda 3 días antes
    if (isInvoice() || isTicket() || isExcessTicket()) {
      const threeDaysAgo = new Date(today)
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      // Si la fecha de emisión está fuera del rango, ajustarla a hoy
      if (emissionDate < threeDaysAgo || emissionDate > today) {
        form.setValue("emisionDate", today)
      }
    }

    if (isCreditInvoice() && creditInfo?.endDateCredit) {
      form.setValue(
        "paymentDate",
        parseLocalDate(creditInfo.endDateCredit) || new Date(),
      )
    }

    // Para nota de venta: validar que no sea futura
    if (isSaleNote() && emissionDate > today) {
      form.setValue("emisionDate", today)
    }
  }, [documentTypeId, paymentType])

  return (
    <>
      <DatePickerForm
        name="emisionDate"
        label="Fecha emisión"
        className="w-full!"
        min={emissionLimits.min}
        max={emissionLimits.max}
      />
      <DatePickerForm
        name="paymentDate"
        label="Fecha vencimiento"
        className="w-full!"
        min={dueLimits.min}
        max={dueLimits.max}
        disabled={isInvoice() || isTicket() || isExcessTicket() || isSaleNote()}
      />
    </>
  )
}
