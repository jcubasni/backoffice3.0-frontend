type PaymentBaseDTO = {
  paymentCode: string
  amountToCollect: number
}

type CreditDTO = PaymentBaseDTO & {
  currencyId: number
}

type CashDTO = PaymentBaseDTO & {
  currencyId: number
  received: number
}

type CardDTO = PaymentBaseDTO & {
  currencyId?: number
  cardTypeCode: string
  referenceDocument: string
}

type CreditNoteDTO = PaymentBaseDTO & {
  currencyId: number
  referenceDocument: string
}

type VoucherDTO = PaymentBaseDTO & {
  currencyId: number
  referenceDocument: string
}

type WalletDto = PaymentBaseDTO & {
  currencyId: number
  walletName: string
  referenceNumber: string
}

export type PaymentDTO =
  | CreditDTO
  | CashDTO
  | WalletDto
  | CardDTO
  | CreditNoteDTO
  | VoucherDTO

export interface PaymentMethod {
  id: number
  name: string
  description: string
  paymentCode: string
  isActive: boolean
  codeComponent: CodeComponent
}

export type CodeComponent = "CP001" | "CP003" | "EMPTY"

export interface PaymentCard {
  cardId: number
  name: string
  code: string
  status: boolean
}

export enum CodeComponentE  {
  CASH = "CP001",
  CARD = "CP003",
  EMPTY = "EMPTY",
}

export enum CurrencyE {
  PEN = 1,
  USD = 2,
}
