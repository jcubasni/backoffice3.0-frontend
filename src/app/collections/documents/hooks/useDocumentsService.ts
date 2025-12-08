import { useMutation, useQuery } from "@tanstack/react-query"
import { applyPayment, getDocuments } from "../services/documents.service"
import { ApplyPaymentDTO, DocumentAPI } from "../types/document.type"

export function useGetDocuments(data: DocumentAPI) {
  return useQuery({
    queryKey: ["documents", data],
    queryFn: () => getDocuments(data),
    enabled: !!data.clientId && !!data.params.startDate,
  })
}

export function useApplyPayment() {
  return useMutation({
    mutationKey: ["pay-installment"],
    mutationFn: ({
      paymentId,
      data,
    }: {
      paymentId: string
      data: ApplyPaymentDTO
    }) => applyPayment(paymentId, data),
  })
}
