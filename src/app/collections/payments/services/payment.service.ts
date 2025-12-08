import { fetchData } from "@/shared/lib/fetch-data"
import { DocumentResponse } from "../../documents/types/document.type"
import { ApplyPaymentDTO } from "../types"
import {
  PaymentDTO,
  PaymentParams,
  PaymentResponse,
} from "../types/payment.type"

export const getPayments = async (
  params: PaymentParams,
): Promise<PaymentResponse[]> => {
  const response = await fetchData<PaymentResponse[]>({
    url: "/credit-payments",
    params,
  })

  return response
}

export const addPayment = async (
  body: PaymentDTO,
): Promise<PaymentResponse> => {
  const response = await fetchData<PaymentResponse>({
    method: "POST",
    url: "/credit-payments",
    body,
  })

  return response
}

export const applyPayment = async (
  paymentId: string,
  body: ApplyPaymentDTO,
) => {
  const response = await fetchData({
    method: "POST",
    url: `/credit-payments/${paymentId}/apply-by-invoice`,
    body,
  })

  return response
}

export const getUnpaidDocuments = async (
  clientId: string,
): Promise<DocumentResponse[]> => {
  const response = await fetchData<DocumentResponse[]>({
    url: `/sale-credits/unpaid/client/${clientId}`,
  })

  return response
}
