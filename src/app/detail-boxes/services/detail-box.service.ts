import { fetchData } from "@/shared/lib/fetch-data"
import {
  DetailBox,
  EditDetailBox,
  TotalsDetailBox,
} from "../types/detail-box.type"

export const getDetailBox = async (
  cashRegisterId: string,
): Promise<DetailBox> => {
  const response = await fetchData<DetailBox>({
    url: `/cash-registers/liquidation/${cashRegisterId}`,
  })
  return response
}

export const getTotalsDetailBox = async (
  cashRegisterId: string,
): Promise<TotalsDetailBox> => {
  const response = await fetchData<TotalsDetailBox>({
    url: `/cash-registers/liquidation/${cashRegisterId}/totals`,
  })
  return response
}

export const preliquidatedDetailBox = async (
  cashRegisterId: string,
  body: EditDetailBox,
) => {
  const response = await fetchData<any>({
    method: "POST",
    url: `/cash-registers/liquidation/pre/${cashRegisterId}`,
    body,
  })
  return response
}

export const saveDetailBox = async (
  cashRegisterId: string,
  body: EditDetailBox,
) => {
  const response = await fetchData<any>({
    method: "PATCH",
    url: `/cash-registers/liquidation/${cashRegisterId}`,
    body,
  })
  return response
}

export const liquidatedDetailBox = async (cashRegisterId: string) => {
  const response = await fetchData<any>({
    url: `/cash-registers/liquidation/${cashRegisterId}/liquidate`,
    method: "PATCH",
  })
  return response
}
