import { useQuery } from "@tanstack/react-query"
import {
  getDepositReport,
  getPaymentTypeReport,
} from "../service/sale-report.service"
import { ByDeposit, ByPaymentType } from "../types/sale-report.type"

export const useSaleByPaymentType = (
  startDate: string,
  endDate: string,
  clientId?: string,
  documentTypes: string[] = [],
  paymentType: string[] = [],
  options: any = {},
) =>
  useQuery<ByPaymentType[]>({
    queryKey: [
      "saleByPaymentType",
      startDate,
      endDate,
      clientId,
      documentTypes,
      paymentType,
    ],
    queryFn: () =>
      getPaymentTypeReport(
        startDate,
        endDate,
        clientId,
        documentTypes,
        paymentType,
      ),
    enabled: !!startDate && !!endDate && options.enabled !== false,
    ...options,
  })



export const useSaleByDeposit = (
  cashRegisterId: string [],
  shiftId: string,
  date: string,
  options: any = {},
) =>
  useQuery<ByDeposit[]>({
    queryKey: ["saleByDeposit", cashRegisterId, shiftId, date],
    queryFn: () => getDepositReport(cashRegisterId, shiftId, date),
    enabled:
      !!cashRegisterId && !!shiftId && !!date && options.enabled !== false,
    ...options,
  })
