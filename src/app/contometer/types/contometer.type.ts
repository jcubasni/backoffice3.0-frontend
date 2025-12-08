export enum ContometerStatus {
  OPENED = "A",
  CLOSED = "C",
}

export type Contometer = {
  id: string
  initialCm: number
  finalCm: number
  hoseName: string
  productForeignName: string
  sideName: string
}

export type DetailContometer = {
  id: string
  finalCm: number
}
