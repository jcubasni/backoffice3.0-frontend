export type Dipstick = {
  id: string
  initialStick: number
  outputs: number
  inputs: number
  theoreticalStick: number
  finalStick: number
  difference: number
  tankId: string
  tankName: string
  productName: string
}

export type DetailDipstick = {
  id: string
  finalStick: number
}
