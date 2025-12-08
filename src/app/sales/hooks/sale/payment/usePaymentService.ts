import { useQuery } from "@tanstack/react-query"
import {
  getPaymentCards,
  getPaymentMethods,
} from "@/app/sales/service/payment.service"
import { dataToCombo } from "@/shared/lib/combo-box"

export function useGetPaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => getPaymentMethods(),
    gcTime: Number.POSITIVE_INFINITY,
    select: (data) => {
      return data.filter((item) => item.codeComponent)
    },
  })
}

export function useGetPaymentCards() {
  return useQuery({
    queryKey: ["payment-cards"],
    queryFn: () => getPaymentCards(),
    staleTime: Number.POSITIVE_INFINITY,
    select: (data) => dataToCombo(data, "code", "name"),
  })
}
