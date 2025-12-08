import { fetchData } from "@/shared/lib/fetch-data"
import {
  DetailBoxes,
  DetailBoxesParams,
  ShortageOverageParams,
  ShortageOverageResponse,
} from "../types/detail-boxes.type"

export const getDetailBoxes = async (
  params: DetailBoxesParams,
): Promise<DetailBoxes[]> => {
  const response = await fetchData<DetailBoxes[]>({
    url: "/cash-registers",
    params,
  })
  return response
}

export const shortageOverage = async (
  params: ShortageOverageParams,
): Promise<ShortageOverageResponse[]> => {
  const response = await fetchData<ShortageOverageResponse[]>({
    url: "/reports/shortage-overage",
    params,
  })
  return response
}
export const getLiquidationReport = async (cashRegister: number) => {
  const response = await fetchData<any>({
    url: "/reports/liquidation",
    params: { cashRegister },
  })
  return response  
}

