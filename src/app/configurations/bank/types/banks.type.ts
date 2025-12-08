export type Bank = {
  id: string
  code: string
  name: string
  isActive: boolean
}

export type UpdateBankActive = {
  id: string
  isActive: boolean
}
