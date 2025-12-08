import { useQuery } from "@tanstack/react-query"
import {
  getDetailBoxes,
  shortageOverage,
   getLiquidationReport,
} from "../services/detail-boxes.service"

import {
  DetailBoxesParams,
  ShortageOverageParams,

} from "../types/detail-boxes.type"

export function useGetDetailBoxes(params: DetailBoxesParams) {
  return useQuery({
    queryKey: ["detail-boxes", params],
    queryFn: () => getDetailBoxes(params),
  })
}

export function useGetShortageOverage(params: ShortageOverageParams) {
  return useQuery({
    queryKey: ["shortage-overage", params],
    queryFn: () => shortageOverage(params),
    enabled: !!params?.cashRegisters?.length,
  })
}
export function useGetLiquidation(cashRegister?: number) {
  return useQuery({
    queryKey: ["liquidation-report", cashRegister],
    queryFn: async () => {
      const data = await getLiquidationReport(cashRegister!)
      return data
    },
    enabled: !!cashRegister,
  })
}

