import { StateAudit } from "@/shared/types/state.type"
import { AddBankAccount } from "../schemas/bank-account.schema"

export type BankAccountBank = {
  id: number
  name: string
}

export type BankAccountCurrency = {
  idCurrency: number
  simpleDescription: string
}

export type BankAccount = {
  id: string
  accountNumber: string
  holderName: string
  bank: BankAccountBank
  currency: BankAccountCurrency
  description: string
  stateAudit: StateAudit
}
export type AddBankAccountDTO = AddBankAccount & {
  holderName: string
}

export type UpdateBankAccountState = {
  id: string
  isActive: boolean
}
