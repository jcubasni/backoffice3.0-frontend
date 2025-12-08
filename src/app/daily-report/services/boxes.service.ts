import { fetchData } from "@/shared/lib/fetch-data"
import {
  AddDailyReportBoxParams,
  Box,
  BoxParams,
  DeleteDailyReportBoxParams,
} from "../types/boxes.type"

export const getBoxes = async (params: BoxParams): Promise<Box[]> => {
  const response = await fetchData<Box[]>({
    url: "/daily-reports/available-cash-registers",
    params,
  })
  return response
}

export const deleteDailyReportBox = async (
  params: DeleteDailyReportBoxParams,
) => {
  const { dailyReportId, cashRegisterId } = params
  const response = await fetchData<any>({
    url: `/daily-reports/${dailyReportId}/remove-cash-register/${cashRegisterId}`,
    method: "DELETE",
  })
  return response
}

export const addDailyReportBox = async (params: AddDailyReportBoxParams) => {
  const { dailyReportId, cashRegisterIds } = params
  const response = await fetchData<any>({
    url: `/daily-reports/${dailyReportId}/add-cash-registers`,
    method: "POST",
    body: { cashRegisterIds },
  })
  return response
}
