// src/app/pdf/hooks/useReports.ts
import { useQuery } from "@tanstack/react-query"
import {
  SalesReport,
  CanceledSalesReport,
  ShortageOverageReport,
  getSalesReport,
  getCanceledSalesReport,
  getShortageOverageReport,
} from "../services/report.service"

export const useSalesReport = (
  startDate: string,
  endDate: string,
  docTypes: string[] = [],
  options: any = {},
) =>
  useQuery<SalesReport[]>({
    queryKey: ["salesReport", startDate, endDate, docTypes],
    queryFn: () => getSalesReport(startDate, endDate, docTypes),
    enabled: !!startDate && !!endDate && options.enabled !== false,
    ...options,
  })

// src/app/pdf/hooks/useReports.ts
export const useCanceledSalesReport = (
  startDate: string,
  endDate: string,
  docTypes: string[] = [], // ahora es array
  options: any = {},
) =>
  useQuery<CanceledSalesReport[]>({
    queryKey: ["canceledSalesReport", startDate, endDate, docTypes],
    queryFn: () => getCanceledSalesReport(startDate, endDate, docTypes),
    enabled:
      !!startDate &&
      !!endDate &&
      docTypes.length > 0 &&
      options.enabled !== false,
    ...options,
  })

export const useShortageOverageReport = (
  startDate: string,
  endDate: string,
  options: any = {},
) =>
  useQuery<ShortageOverageReport[]>({
    queryKey: ["shortageOverageReport", startDate, endDate],
    queryFn: () => getShortageOverageReport(startDate, endDate),
    enabled: !!startDate && !!endDate && options.enabled !== false,
    ...options,
  })
