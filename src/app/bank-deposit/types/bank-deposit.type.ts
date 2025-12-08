export type Deposit = {
  id: string
  depositNumber: string
  accountNumber: string
  depositDate: string
  depositAmount: string
  hasDetail: boolean
}

export type AddDeposit = {
  depositDate: string
  bank: string
  accountNumber: string
  currency: string
  depositAmount: number
  // imageUrl?: File
  observation?: string
  money?: Omit<MoneyDetail, "id">[]
}

type MoneyDetail = {
  id: string
  denomination: number
  quantity: number
  total?: number
  type: "BILLETE" | "MONEDA"
}

export type PreviewDeposit = {
  depositDate: string
  depositNumber: string
  bank: string
  accountNumber: string
  currency: string
  depositAmount: string
  imageUrl: null
  observation: string | null
  moneyDetails: MoneyDetail[]
}

export type EditDeposit = {
  id: string
  observation: string
}
