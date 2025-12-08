import { fetchData } from "@/shared/lib/fetch-data"
import { CashRegisterResponse, HasOpen } from "../types/cash-register.type"

export const getHasOpen = async (): Promise<HasOpen> => {
  return await fetchData<HasOpen>({
    url: `/cash-registers/has-open`,
  })
}

export const openCashRegister = async (): Promise<CashRegisterResponse> => {
  return await fetchData<CashRegisterResponse>({
    url: `/cash-registers/open`,
    method: "POST",
  })
}
