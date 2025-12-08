export interface ShortageOverageData {
  company: string
  ruc: string
  address: string
  startDate?: string
  endDate?: string
  mode?: "cashRegister" | "user"
  turns: Turn[]
}

export interface Turn {
  name: string
  date: string
  boxes: Box[]
}

export interface Box {
  // Modo cashRegister
  code?: string
  responsible?: string

  // Modo user
  registerCode?: string
  shiftName?: string
  userName?: string

  // Común
  deposit: { cash: number; card: number }
  sales: { cash: number; card: number }
  balance: number
}
