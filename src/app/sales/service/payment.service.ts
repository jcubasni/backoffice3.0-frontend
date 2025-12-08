import { fetchData } from "@/shared/lib/fetch-data"
import { PaymentCard, PaymentMethod } from "../types/payment"

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await fetchData<PaymentMethod[]>({
    url: "/payment-methods",
  })
  return response
}

export const getPaymentCards = async (): Promise<PaymentCard[]> => {
  // const response = await fetchData<PaymentCard[]>({
  //   url: "/payment/cards",
  // })
  // return response
  return [
    { cardId: 1, name: "VISA", code: "VISA", status: true },
    { cardId: 2, name: "MASTERCARD", code: "MC", status: true },
  ]
}
