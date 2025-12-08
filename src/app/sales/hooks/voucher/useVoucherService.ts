import { useQuery } from "@tanstack/react-query"
import { getSaleNotes } from "../../service/voucher.service"
import { VoucherParams } from "../../types/voucher.type"

export function useGetSaleNotes(params: VoucherParams, clientId?: string) {
  const { startDate } = params
  return useQuery({
    queryKey: ["sale-notes", clientId, params],
    queryFn: () => getSaleNotes(clientId!, params),
    enabled: !!startDate && !!clientId,
  })
}
