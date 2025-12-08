import { DocumentTypeResponse } from "@/app/accounts/types/client.type"

export type ReasonResponse = {
  id: number
  sunatCode: string
  description: string
  active: boolean
}

export type DocumentShortResponse = {
  id: string
  documentNumber: string
  totalAmount: number
}

export type DocumentShortParams = {
  clientId?: string
  term?: string
  isCredit?: boolean
}

export type NotesProduct = {
  id: string
  productCode: string
  description: string
  measurementUnit: string
  quantity: number
  unitPrice: number
  subtotal: number
  total: number
}

export type ReferencedSaleResponse = {
  id: string
  documentNumber: string
}

export type ReasonDetailResponse = {
  id: number
  description: string
}

export type ClientResponse = {
  id: string
  firstName: string
  lastName: string | null
  documentNumber: string
  documentType: DocumentTypeResponse
}

export type UserResponse = {
  id: string
}

export type NotesResponse = {
  id: string
  documentNumber: string
  serie: string
  number: number
  issueDate: string
  createdAt: string
  status: string
  subtotal: number
  igvAmount: number
  totalDiscount: number
  totalAmount: number
  currencyId: number
  referenceDocumentNumber: string
  description: string
  referencedSale: ReferencedSaleResponse
  reason: ReasonDetailResponse
  client: ClientResponse
  createdBy: UserResponse
  updatedBy: UserResponse
  items: NotesProduct[]
}

export type NotesParams = {
  startDate?: string
  endDate?: string
}

export type InstallmentResponse = {
  amount: number
  createdAt: string
  documentNumber: string
  dueDate: string
  id: string
  installmentNumber: number
  paid: boolean
  paidAmount: number
  paidAt: string
  saleId: string
}

export type InstallmentDTO = {
  newDueDate: string
  newAmount: number
}
