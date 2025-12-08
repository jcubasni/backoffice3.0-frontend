import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver, useForm } from "react-hook-form"
import { useModalStore } from "@/shared/store/modal.store"
import { shouldOpenPaymentModal } from "../../lib/sale/payment.util"
import { validateProducts } from "../../lib/sale/products.util"
import { getSaleSchema, SaleSchema } from "../../schemas/sale.schema"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import { SalesProduct } from "../../types/product.type"
import { useSaleHelpers } from "./useSale.helper"
import { useAddSale as useAddSaleMutation } from "./useSaleService"

export const useAddSale = () => {
  const addSaleMutation = useAddSaleMutation()
  const resetClientUtil = useClientUtilStore((state) => state.resetClientUtil)

  const {
    getFieldsRequiredValidation,
    getOperationType,
    getPayloadBuilder,
    isCreditInvoice,
  } = useSaleHelpers()

  const schema = getSaleSchema(getFieldsRequiredValidation())

  const form = useForm<SaleSchema>({
    resolver: zodResolver(schema) as Resolver<SaleSchema>,
    defaultValues: {
      payments: [],
      creditInvoiceInfo: {
        installmentCount: 0,
        periodStart: new Date(),
        periodEnd: new Date(),
      },
      emisionDate: new Date(),
    },
    resetOptions: {
      keepDefaultValues: true,
    },
  })

  const handleSubmit = async (data: SaleSchema, products: SalesProduct[]) => {
    if (!validateProducts(products)) return
    if (!shouldOpenPaymentModal(data, form)) return

    if (
      isCreditInvoice() &&
      (!data.creditInvoiceInfo || data.creditInvoiceInfo.installmentCount === 0)
    ) {
      return useModalStore.getState().openModal("modal-installment")
    }

    const buildPayload = getPayloadBuilder()
    const salePayload = buildPayload(data, products, getOperationType())
    console.log(salePayload)

    addSaleMutation.mutate(salePayload, {
      onSuccess: () => {
        form.reset()
        useProductStore.getState().resetProduct()
        resetClientUtil()
        form.clearErrors()
      },
      onError: () => {
        form.resetField("payments")
        form.resetField("creditInvoiceInfo")
      },
    })
  }

  return {
    form,
    handleSubmit,
    addSaleMutation,
  }
}
