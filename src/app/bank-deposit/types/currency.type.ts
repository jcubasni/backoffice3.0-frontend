export type CurrencyQuantities = { [key: number]: number }

export type CurrencyEntry = {
  denomination: number
  quantity: number
  total?: number
  type: ECurrencyEntry
}

export enum ECurrencyEntry {
  MONEDA = "MONEDA",
  BILLETE = "BILLETE",
}
