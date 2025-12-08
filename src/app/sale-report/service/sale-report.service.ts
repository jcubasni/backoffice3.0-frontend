import { fetchData } from "@/shared/lib/fetch-data"
import {
  ByDeposit,
  ByPaymentType,
} from "../types/sale-report.type"

export const getPaymentTypeReport = async (
  startDate: string,
  endDate: string,
  clientId?: string,
  documentTypes: string[] = [],
  paymentType: string[] = [],
): Promise<ByPaymentType[]> => {
  // Construir params dinámicamente
  const params: Record<string, any> = { startDate, endDate }

  if (clientId) params.clientId = clientId // solo si hay valor
  if (documentTypes.length > 0) params.documentTypes = documentTypes
  if (paymentType.length > 0) params.paymentType = paymentType

  //
  const res = await fetchData<ByPaymentType[]>({
    url: "/reports/sale/by-payment-type",
    params,
  })

  return res
}


export const getDepositReport = async (
  cashRegisterId?: string[], 
  shiftId?: string,
  date?: string,
): Promise<ByDeposit[]> => {
  // Creamos un objeto vacío y agregamos solo lo que tenga valor
  const params: Record<string, any> = {}

  // Enviamos array como array, no como string
  if (cashRegisterId?.length) {
    params.cashRegisterId = cashRegisterId
  }

  if (shiftId) {
    params.shiftId = shiftId
  }

  if (date) {
    params.date = date
  }

  const res = await fetchData<ByDeposit[]>({
    url: "/reports/sale/by-deposit",
    params,
  })

  return res
}


