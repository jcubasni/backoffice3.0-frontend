import { fetchData } from "@/shared/lib/fetch-data"
import { SaleNotesResponse, VoucherParams } from "../types/voucher.type"

export const getSaleNotes = async (
  clientId: string,
  params: VoucherParams,
): Promise<SaleNotesResponse[]> => {
  return await fetchData<SaleNotesResponse[]>({
    url: `/sales/sale-notes/client/${clientId}`,
    params,
  })
}
