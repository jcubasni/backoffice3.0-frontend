import { UseFormReturn } from "react-hook-form"
import { useShallow } from "zustand/react/shallow"
import { ProductGroup } from "@/app/products/types/product.enum"
import {
  buildCreditInvoicePayload,
  buildSaleNotePayload,
  buildSalePayload,
} from "../../lib/sale/sale.util"
import { RequiredSchemas, SaleSchema } from "../../schemas/sale.schema"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import { SalesProduct } from "../../types/product.type"
import {
  OperationType,
  PaymentType,
  SaleDocumentType,
  SaleDTO,
} from "../../types/sale"

type PayloadBuilder = (
  data: SaleSchema,
  products: SalesProduct[],
  operationType: OperationType,
) => SaleDTO

export function useSaleHelpers() {
  const saleType = useClientUtilStore((state) => state.documentTypeId)
  const { total } = useProductStore((state) => state.totals)
  const products = useProductStore((state) => state.products)
  const {
    isVoucher: isVoucherExchange,
    isFreeTransfer,
    paymentType,
    isAdvance: isAdvancePayment,
    selectedClientData,
  } = useClientUtilStore(
    useShallow((state) => ({
      isFreeTransfer: state.isFreeTransfer,
      isVoucher: state.isVoucher,
      isAdvance: state.isAdvance,
      paymentType: state.paymentType,
      selectedClientData: state.selectedClientData,
    })),
  )

  const hasFuelProducts = () => {
    return products.some(
      (product) => product.groupProduct?.id === ProductGroup.COMBUSTIBLES,
    )
  }

  const isSaleNote = () => {
    return saleType === SaleDocumentType.NOTA_VENTA
  }

  const isCreditInvoice = () => {
    return (
      saleType === SaleDocumentType.FACTURA &&
      paymentType === PaymentType.CREDIT
    )
  }

  const isFreeTransaction = () => {
    return isFreeTransfer
  }

  const isTicket = () => {
    return saleType === SaleDocumentType.BOLETA && total < 700
  }

  const isExcessTicket = () => {
    return saleType === SaleDocumentType.BOLETA && total >= 700
  }

  const isInvoice = () => {
    return (
      saleType === SaleDocumentType.FACTURA && paymentType === PaymentType.CASH
    )
  }

  const isVoucher = () => {
    return isVoucherExchange
  }

  const isAdvance = () => {
    return isAdvancePayment
  }

  const isRetention = () => {
    return (
      saleType === SaleDocumentType.FACTURA &&
      paymentType === PaymentType.CASH &&
      !!selectedClientData?.has_retention &&
      total >= 700
    )
  }

  const operationUseCases: Array<{
    condition: () => boolean
    operationType: OperationType
    requiredValidation: RequiredSchemas[]
    payloadBuilder: PayloadBuilder
  }> = [
    {
      condition: isFreeTransaction,
      operationType: OperationType.TRANSFERENCIA_GRATUITA,
      requiredValidation: hasFuelProducts()
        ? ["clientInfo", "vehicleInfo"]
        : ["clientInfo"],
      payloadBuilder: buildSalePayload,
    },
    {
      condition: isRetention,
      operationType: OperationType.CASH,
      requiredValidation: ["clientInfo", "vehicleInfo", "retentionInfo"],
      payloadBuilder: buildSalePayload,
    },
    {
      condition: isAdvance,
      operationType: OperationType.ANTICIPO,
      requiredValidation: ["clientInfo", "vehicleInfo"],
      payloadBuilder: buildSalePayload,
    },
    {
      condition: isVoucher,
      operationType: OperationType.CANJE,
      requiredValidation: ["clientInfo", "vehicleInfo"],
      payloadBuilder: buildSalePayload,
    },
    {
      condition: isCreditInvoice,
      operationType: OperationType.CREDIT,
      requiredValidation: ["clientInfo", "vehicleInfo", "creditInvoiceInfo"],
      payloadBuilder: buildCreditInvoicePayload,
    },
    // {
    //   condition: isSaleNoteIntern,
    //   operationType: OperationType.INTERN,
    //   requiredValidation: ["clientInfo", "vehicleInfo", "driverInfo"],
    // },
    // {
    //   condition: isSaleNoteSerafin,
    //   operationType: OperationType.SERAFIN,
    //   requiredValidation: ["clientInfo", "driverInfo"],
    // },
    {
      // condition: () => isSaleNoteCredit() || isSaleNote(),
      condition: () => isSaleNote(),
      operationType: OperationType.CREDIT,
      //   requiredValidation: ["clientInfo", "vehicleInfo", "driverInfo"],
      requiredValidation: ["clientInfo", "vehicleInfo"],
      payloadBuilder: buildSaleNotePayload,
    },
    {
      condition: isTicket,
      operationType: OperationType.CASH,
      requiredValidation: [],
      payloadBuilder: buildSalePayload,
    },
    {
      condition: isExcessTicket,
      operationType: OperationType.CASH,
      requiredValidation: ["clientInfo", "vehicleInfo"],
      payloadBuilder: buildSalePayload,
    },
    {
      condition: isInvoice,
      operationType: OperationType.CASH,
      requiredValidation: ["clientInfo", "vehicleInfo"],
      payloadBuilder: buildSalePayload,
    },
  ]

  const getOperationDetails = () => {
    return (
      operationUseCases.find((useCase) => useCase.condition()) ?? {
        operationType: OperationType.CASH,
        requiredValidation: [],
        payloadBuilder: buildSalePayload,
      }
    )
  }

  const getOperationType = () => getOperationDetails().operationType

  const getFieldsRequiredValidation = () =>
    getOperationDetails().requiredValidation

  const getPayloadBuilder = () => getOperationDetails().payloadBuilder

  const resetForm = (form: UseFormReturn<SaleSchema>) => {
    if (form) {
      form.reset()
      form.resetField("payments")
      form.resetField("creditInvoiceInfo")
      form.clearErrors()
    }
    useProductStore.getState().resetProduct()
    useClientUtilStore.getState().resetClientUtil()
  }

  return {
    isAdvance,
    isVoucher,
    isRetention,
    isSaleNote,
    isTicket,
    isInvoice,
    isCreditInvoice,
    isFreeTransaction,
    isExcessTicket,
    getOperationType,
    getFieldsRequiredValidation,
    getPayloadBuilder,
    resetForm,
  }
}
