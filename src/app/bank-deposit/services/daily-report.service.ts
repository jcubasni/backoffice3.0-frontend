import { fetchData } from "@/shared/lib/fetch-data"
import {
  AddReportsToDeposit,
  AvailableReports,
  DeleteReportFromDeposit,
  ReportsOfDeposit,
} from "../types/daily-report.type"

export const getAvailableReports = async (): Promise<AvailableReports[]> => {
  const response = await fetchData<AvailableReports[]>({
    url: "/bank-deposits/available-daily-reports",
  })
  return response
}

export const getSelectedReports = async (
  id: string,
): Promise<ReportsOfDeposit> => {
  const response = await fetchData<ReportsOfDeposit>({
    url: `/bank-deposits/${id}/preview`,
  })
  return response
}

export const addReportsToDeposit = async (
  params: AddReportsToDeposit,
): Promise<any> => {
  const { idDeposit, assignDetails } = params
  const response = await fetchData<any>({
    url: `/bank-deposits/${idDeposit}/assign-daily-reports`,
    method: "POST",
    body: {
      assignDetails,
    },
  })
  return response
}

export const deleteReportFromDeposit = async (
  params: DeleteReportFromDeposit,
): Promise<any> => {
  const { id, dailyReportIds } = params
  const response = await fetchData<any>({
    url: `/bank-deposits/${id}/unassign-daily-reports`,
    method: "DELETE",
    body: {
      dailyReportIds,
    },
  })
  return response
}
