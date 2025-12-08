import { InstallmentResponse } from "@/app/billing-notes/types/notes.type"
import { StateAudit } from "@/shared/types/state.type"

export enum DocumentState {
  ACTIVO = 1,
  ANULADO = 2,
}

export type DocumentParams = {
  startDate?: string
  endDate?: string
}

export type DocumentAPI = {
  clientId?: string
  params: DocumentParams
}

export type DocumentResponse = {
  id: string
  saleId: string
  paymentTermDays: number
  documentNumber: string
  periodStart: string
  periodEnd: string
  installmentsCount: number
  paidAmount: number
  outstanding: number
  createdAt: string
  updatedAt: string
  stateAudit: StateAudit
  status: DocumentState
  paid: boolean
  paidAt: string | null
  amount: number
}

export type DocumentData = {
  data: InstallmentResponse[]
  saleCreditId: string
}

type ItemPaymentDTO = {
  saleCreditId: string
  installmentId: string
  amount: number
}

export type ApplyPaymentDTO = {
  items: ItemPaymentDTO[]
}
