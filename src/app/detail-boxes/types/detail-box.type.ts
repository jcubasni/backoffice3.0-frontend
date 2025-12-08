import { DetailBoxesStatus } from "./detail-boxes.type"

export type DetailBox = {
  cashRegisterId: number
  cashRegisterState: DetailBoxesStatus
  details: DetailMovementBox[]
}

export type DetailMovementBox = {
  movementType: string
  movementTypeCode: string
  totalAmount: number
  foundAmount: number | null
  difference: number | null
  observations: string | null
}

export type EditDetailBox = {
  totalAmount: number
  totalFoundMount: number
  observations?: string
  details: DetailEditDetailBox[]
}

export type DetailEditDetailBox = {
  codeDepositType: string
  amount: number
  foundMount: number
  observations?: string
}

export type TotalsDetailBox = {
  totalAmount: number
  totalCards: number
}
