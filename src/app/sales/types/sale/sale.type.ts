import { DocumentTypeResponse } from "@/app/accounts/types/client.type"
import { GeneralType } from "@/shared/types/general-type"

export type ClientResponse = {
  firstName: string
  lastName: string
  documentType: DocumentTypeResponse
  id: string
  documentNumber: string
}

export type CashRegisterResponse = {
  cashRegisterCode: number
}

export type SaleResponse = {
  id: string
  documentType: DocumentTypeResponse
  documentNumber: string
  totalAmount: number
  createdAt: string
  client: ClientResponse
  cashRegister: CashRegisterResponse
  issueDate: string
  hasReference: boolean
  dateOfDue: string
  isUsed: boolean
  documentOperationType: DocumentOperationTypeResponse
  saleOperationType: SaleOperationTypeResponse
  user: UserResponse
  state?: 1 | 0
}

type DocumentOperationTypeResponse = {
  id?: number
  name?: string
}

type SaleOperationTypeResponse = {
  id: number
  name: string
}

type UserResponse = {
  id: string
  name: string
}

export type SaleType = GeneralType

export type DateFilters = {
  startDate?: string
  endDate?: string
}

export type AdvanceResponse = {
  id: string
  totalAmount: number
  documentNumber: string
}

type LocalResponse = {
  id: string
  name: string | null
  address: string
}

export type DetailResponse = {
  id: string
  quantity: number
  unitPrice: number
  productForeignName: string
  productCode: string
  measurementUnit: string
}

type PaymentMethodResponse = {
  id: number
  name: string
  code: string
}

type PaymentResponse = {
  id: string
  date: string
  amount: number
  currencyId: number
  paymentMethod: PaymentMethodResponse
}

export type DocumentResponse = Pick<
  SaleResponse,
  | "id"
  | "documentNumber"
  | "createdAt"
  | "totalAmount"
  | "client"
  | "user"
  | "isUsed"
> & {
  local: LocalResponse
  details: DetailResponse[]
  payments: PaymentResponse[]
  advanceBalance: number
}
