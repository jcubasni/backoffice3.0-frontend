import { PaymentSchema } from "../schemas/payment.schema"

export type PaymentDTO = PaymentSchema & {
  reference?: string
  notes?: string
  paymentMethod?: string
}

export type PaymentParams = {
  startDate?: string
  endDate?: string
}

export type PaymentDocumentType = {
  name: string
}

export type PaymentClient = {
  id: string
  firstName: string
  lastName: string
  documentNumber: string
  documentType: PaymentDocumentType
}

export type PaymentApplication = {
  id: string
  saleId: string
  installmentId?: string | null
  amount: string
  documentNumberAffect: string
}

export type PaymentUser = {
  userName: string
}

export type PaymentResponse = {
  id: string
  client: PaymentClient
  amount: number
  currencyId?: number | null
  reference?: string | null
  paymentMethod?: string | null
  paymentDate?: string | null
  notes?: string | null
  bank?: string | null
  account?: string | null
  operationNumber?: string | null
  transactionImageUrl?: string | null
  remainingAmount: number
  applications?: PaymentApplication[]
  user: PaymentUser
  createdAt?: string | null
  updatedAt?: string | null
}
