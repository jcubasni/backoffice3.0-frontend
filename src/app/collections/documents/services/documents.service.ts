import { fetchData } from "@/shared/lib/fetch-data"
import {
  ApplyPaymentDTO,
  DocumentAPI,
  DocumentResponse,
} from "../types/document.type"

export const getDocuments = async (
  data: DocumentAPI,
): Promise<DocumentResponse[]> => {
  const response = await fetchData<DocumentResponse[]>({
    url: `/sale-credits/client/${data.clientId}`,
    params: data.params,
  })

  return response
}

export const applyPayment = async (
  paymentId: string,
  body: ApplyPaymentDTO,
) => {
  const response = await fetchData<DocumentResponse>({
    method: "POST",
    url: `/credit-payments/${paymentId}/apply`,
    body,
  })

  return response
}
