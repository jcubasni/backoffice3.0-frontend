import { addDays, format } from "date-fns"
import { SaleSchema } from "../../schemas/sale.schema"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import { SalesProduct } from "../../types/product.type"
import {
  idAdvanceProduct,
  OperationType,
  RetentionDataDTO,
  RetentionPercentage,
  SaleDTO,
} from "../../types/sale"
import { buildPaymentsDTO, calculateInstallmentPlan } from "./payment.util"
import {
  calculateAdvanceDataAndAmount,
  calculateRootDetractionData,
  fromProductsToSaleDetails,
} from "./products.util"

export const buildSaleBasePayload = (
  data: SaleSchema,
  products: SalesProduct[],
  operationType: OperationType,
): SaleDTO => {
  const regularProducts = products.filter(
    (p) => p.productId !== idAdvanceProduct,
  )
  const saleDetails = fromProductsToSaleDetails(regularProducts)
  const cashRegisterId = useClientUtilStore.getState().cashRegisterId
  const { totals } = useProductStore.getState()

  // Use form emission date or fallback to current date
  const emissionDate =
    data.emisionDate instanceof Date ? data.emisionDate : new Date()
  const documentTypeId = useClientUtilStore.getState().documentTypeId
  const paymentTypeId = useClientUtilStore.getState().paymentType

  return {
    documentOperationType: 1,
    paymentTypeId: paymentTypeId,
    cashRegisterId: cashRegisterId!,
    serieId: data.serieId,
    subTotal: totals.subtotal,
    taxTotal: totals.igv,
    grandTotal: totals.total,
    freeTransferAmount: totals.freeTransfer,
    exemptAmount: 0.0,
    taxableAmount: totals.subtotal,
    discountTotal: 0.0,
    saleDateTime: format(emissionDate, "yyyy-MM-dd'T'HH:mm:ss"),
    notes: data.notes,
    clientExists: !!data.clientInfo,
    documentTypeId,
    operationType: operationType,
    clientInfo: data.clientInfo,
    vehicleInfo: data.vehicleInfo,
    saleDetails: saleDetails,
    payments: data.payments ? buildPaymentsDTO(data.payments) : [],
    issueDate: format(emissionDate, "yyyy-MM-dd"),
    totalToPay: totals.totalToPay,
  }
}

export const buildSaleNotePayload = (
  data: SaleSchema,
  products: SalesProduct[],
  operationType: number,
): SaleDTO => {
  const basePayload = buildSaleBasePayload(data, products, operationType)
  const paymentDate =
    data.paymentDate instanceof Date ? data.paymentDate : new Date()
  const emissionDate =
    data.emisionDate instanceof Date ? data.emisionDate : new Date()
  const totals = useProductStore.getState().totals

  return {
    ...basePayload,
    payments: [],
    creditData: {
      cardId: data.cardId || "",
      termDays: 2,
      installmentCount: 5,
      periodStart: format(emissionDate, "yyyy-MM-dd"),
      periodEnd: format(addDays(paymentDate, 1), "yyyy-MM-dd"),
      installmentPlan: [
        {
          dueDate: format(paymentDate, "yyyy-MM-dd"),
          installmentNumber: 1,
          amount: totals.totalToPay,
        },
      ],
    },
  }
}

export const buildSalePayload = (
  data: SaleSchema,
  products: SalesProduct[],
  operationType: OperationType,
): SaleDTO => {
  const basePayload = buildSaleBasePayload(data, products, operationType)
  const { totals } = useProductStore.getState()
  // const payments = generateSalePayments(data, products)
  const { advanceData, totalUsedAmount } =
    calculateAdvanceDataAndAmount(products)

  // Extract refSaleIds and refDocumentNumbers from products
  const refSaleIds = products.flatMap((p) => p.refSaleIds || [])
  const refDocumentNumbers = products.flatMap((p) => p.refDocumentNumbers || [])

  // Calculate root level detraction data (optional)
  const rootDetractionData = calculateRootDetractionData(products)

  // Calculate retention data (optional)
  // NOTE: If there is detraction data, retention data cannot be included
  const retentionData: RetentionDataDTO | undefined =
    !rootDetractionData && data.retentionInfo
      ? {
          retentionTypeId: data.retentionInfo.retentionTypeId,
          baseAmount: totals.subtotal,
          percentage: RetentionPercentage,
          retentionAmount: totals.retentionAmount,
          retentionNumber: "0",
        }
      : undefined

  return {
    ...basePayload,
    ...(advanceData.length > 0 && { advanceData }),
    ...(totalUsedAmount > 0 && { advanceAmount: totalUsedAmount }),
    ...(rootDetractionData && { detractionData: rootDetractionData }),
    ...(retentionData && { retentionData }),
    ...(refSaleIds && refSaleIds.length > 0 && { refSaleIds }),
    ...(refDocumentNumbers &&
      refDocumentNumbers.length > 0 && { refDocumentNumbers }),
  }
}

export const buildCreditInvoicePayload = (
  data: SaleSchema,
  products: SalesProduct[],
  operationType: OperationType,
): SaleDTO => {
  const basePayload = buildSaleBasePayload(data, products, operationType)
  const { totals } = useProductStore.getState()

  const installmentPlan = calculateInstallmentPlan(
    data.creditInvoiceInfo?.installmentCount || 0,
    data.creditInvoiceInfo?.periodStart || new Date(),
    data.creditInvoiceInfo?.periodEnd || new Date(),
    totals.totalToPay,
  )

  return {
    ...basePayload,
    payments: [],
    creditData: {
      cardId: data.cardId || "",
      termDays: 2,
      installmentCount: data.creditInvoiceInfo?.installmentCount || 0,
      periodStart: format(
        data.creditInvoiceInfo?.periodStart || new Date(),
        "yyyy-MM-dd",
      ),
      periodEnd: format(
        data.creditInvoiceInfo?.periodEnd || new Date(),
        "yyyy-MM-dd",
      ),
      installmentPlan,
    },
  }
}
