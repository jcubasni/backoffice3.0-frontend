import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { getFirstError } from "@/shared/lib/error"
import { useModalStore } from "@/shared/store/modal.store"
import { DefaultPayment } from "../../lib/sale/payment.util"
import { Modals } from "../../lib/sale/sale-modals-name"
import { SaleSchema } from "../../schemas/sale.schema"
import { useProductStore } from "../../store/product.store"
import { OperationType } from "../../types/sale"
import { useSaleHelpers } from "./useSale.helper"
import { useAddSale } from "./useSaleService"

interface UseSaleSubmitOptions {
  form: UseFormReturn<SaleSchema>
}

export const useSaleSubmit = ({ form }: UseSaleSubmitOptions) => {
  const { isCreditInvoice, getOperationType, resetForm, getPayloadBuilder } =
    useSaleHelpers()
  const newSale = useAddSale()
  const openModal = useModalStore((state) => state.openModal)
  const products = useProductStore.getState().products
  const buildPayload = getPayloadBuilder()

  const processSale = (data: SaleSchema, saleType: OperationType) => {
    newSale.mutate(buildPayload(data, products, saleType), {
      onSuccess: () => {
        resetForm(form)
      },
    })
  }

  const handleSubmitSale = form.handleSubmit(
    (data) => {
      const saleType = getOperationType()
      const total = useProductStore.getState().totals.totalToPay
      const products = useProductStore.getState().products

      if (products.length === 0)
        return toast.error("Debe seleccionar al menos un producto")

      console.log(saleType, total)
      if (
        (saleType === OperationType.CASH ||
          saleType === OperationType.ANTICIPO) &&
        total > 0 &&
        data.payments.length === 0
      ) {
        console.log("payment", "entre")
        form.setValue("payments", DefaultPayment(total))
        return openModal(Modals.PAYMENT, (payments: SaleSchema["payments"]) => {
          const updatedData = { ...data, payments }
          processSale(updatedData, saleType)
        })
      }

      if (saleType === OperationType.TRANSFERENCIA_GRATUITA) {
        console.log("transferencia gratuita")
        processSale(data, saleType)
      }

      processSale(data, saleType)
    },
    (e) => {
      console.log(e)
      const error = getFirstError(e)
      toast.error(error.error)
    },
  )

  return handleSubmitSale
}
