export type PaymentItem = {
  saleCreditId: string
  amount: number
}

export type ApplyPaymentDTO = {
  items: PaymentItem[]
}

export type ApplyPaymentParams = {
  body: ApplyPaymentDTO
  paymentId: string
}
