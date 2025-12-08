import { PaymentDTO } from "../payment/payment.type"

export type ClientInfoDTO = {
  documentTypeId: number
  documentNumber: string
  firstName: string
  lastName?: string | null
  email?: string
  address?: string | null
}

export type TaxDetailDTO = {
  type: string
  amount: number
}

export type DetractionDataDTO = {
  detractionTypeId: number
  baseAmount: number
  percentage: number
  detractionAmount: number
  accountNumber: string
  voucherNumber?: string
  voucherDate?: string
}

export type SaleDetailDTO = {
  taxDetail: TaxDetailDTO
  productId: number
  quantity: number
  unitPrice: number
  taxAmount: number
  grandTotal: number
  detractionData?: DetractionDataDTO
}

export type CreditDataDTO = {
  cardId: string
  termDays: number
  installmentCount: number
  periodStart: string
  periodEnd: string
  installmentPlan: InstallmentDTO[]
}

export type InstallmentDTO = {
  dueDate: string
  installmentNumber: number
  amount: number
}

export type VehicleInfoDTO = {
  plate: string
  mileage?: number
}

export type RetentionDataDTO = {
  retentionTypeId: number
  baseAmount: number
  percentage: number
  retentionAmount: number
  retentionNumber?: string
  retentionDate?: string
}

export type AdvanceDataDTO = {
  referenceDocument: string
  appliedAmount: number
}

export type AddSaleDTO = {
  paymentTypeId: number
  cashRegisterId: string
  serieId: number
  subTotal: number
  taxTotal: number
  grandTotal: number
  freeTransferAmount: number
  exemptAmount: number
  taxableAmount: number
  discountTotal: number
  saleDateTime: string
  notes?: string
  documentTypeId: number
  clientExists: boolean
  operationType: number
  clientInfo: ClientInfoDTO
  vehicleInfo: VehicleInfoDTO
  saleDetails: SaleDetailDTO[]
  payments: PaymentDTO[]
  documentOperationType: 1
  //Credit
  issueDate?: string
  creditData?: CreditDataDTO
  //Voucher
  refSaleIds?: string[]
  refDocumentNumbers?: string[]
  //Retention
  retentionData?: RetentionDataDTO
  totalToPay: number
  //Advance
  advanceData?: AdvanceDataDTO[]
  advanceAmount?: number
  //Detraction (root level)
  detractionData?: DetractionDataDTO
}

export type AddSaleBaseDTO = {
  paymentTypeId: number
  cashRegisterId: string
  serieId: string
  subTotal: number
  taxTotal: number
  grandTotal: number
  freeTransferAmount: number
  exemptAmount: number
  taxableAmount: number
  discountTotal: number
  saleDateTime: string
  notes?: string
  documentTypeId: number
  clientExists: boolean
  operationType: number
  clientInfo?: ClientInfoDTO
  vehicleInfo?: VehicleInfoDTO
  saleDetails: SaleDetailDTO[]
  payments: PaymentDTO[]
  documentOperationType: 1
  totalToPay: number
}

type TicketDTO = AddSaleBaseDTO
type InvoiceDTO = AddSaleBaseDTO & {
  advanceData?: AdvanceDataDTO[]
  advanceAmount?: number
  refSaleIds?: string[]
  refDocumentNumbers?: string[]
  retentionData?: RetentionDataDTO
  detractionData?: DetractionDataDTO
}
type CreditInvoiceDTO = AddSaleBaseDTO & {
  issueDate?: string
  creditData: CreditDataDTO
}
type RetentionDTO = AddSaleBaseDTO & {
  retentionData: RetentionDataDTO
  advanceData?: AdvanceDataDTO[]
  advanceAmount?: number
}
type SaleNoteDTO = AddSaleBaseDTO & {
  refSaleIds?: string[]
  refDocumentNumbers?: string[]
}
type DetractionDTO = AddSaleBaseDTO & {
  detractionData: DetractionDataDTO
}

export type SaleDTO =
  | TicketDTO
  | InvoiceDTO
  | CreditInvoiceDTO
  | RetentionDTO
  | SaleNoteDTO
  | DetractionDTO
