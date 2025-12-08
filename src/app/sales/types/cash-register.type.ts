export type HasOpen = {
  hasOpen: boolean
  cashRegister?: CashRegister
}

type CashRegister = {
  id: string
  code: number
  openingDate: Date
}

export type CashRegisterResponse = {
  id: string
  code: number
}
