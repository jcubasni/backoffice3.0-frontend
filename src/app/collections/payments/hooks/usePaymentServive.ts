import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addPayment,
  applyPayment,
  getPayments,
  getUnpaidDocuments,
} from "../services/payment.service"
import { ApplyPaymentParams } from "../types"
import { PaymentDTO, PaymentParams } from "../types/payment.type"

export function useGetPayments(params: PaymentParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
    enabled: !!params.startDate,
  })
}

export function useAddPayment() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-payment"],
    mutationFn: (body: PaymentDTO) => addPayment(body),
    onSuccess: () => {
      toast.success("Pago agregado exitosamente")
      useModalStore.getState().closeModal("modal-new-payment")
      query.invalidateQueries({ queryKey: ["payments"], exact: false })
    },
  })
}

export function useApplyPayment() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["apply-payment-by-invoice"],
    mutationFn: ({ paymentId, body }: ApplyPaymentParams) =>
      applyPayment(paymentId, body),
    onSuccess: () => {
      toast.success("Pago aplicado exitosamente")
      query.invalidateQueries({ queryKey: ["payments"], exact: false })
    },
  })
}

export function useGetUnpaidDocuments(clientId?: string) {
  return useQuery({
    queryKey: ["unpaid-documents", clientId],
    queryFn: () => getUnpaidDocuments(clientId!),
    enabled: !!clientId,
  })
}
