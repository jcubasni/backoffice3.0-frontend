import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addDailyReport,
  closeDailyReport,
  getDailyReportBoxes,
  getDailyReports,
} from "../services/daily-reports.service"
import { AddDailyReport } from "../types/add-daily-report.type"

export function useGetDailyReports() {
  return useQuery({
    queryKey: ["daily-reports"],
    queryFn: getDailyReports,
  })
}

export function useGetDailyReportBoxes(dailyReportId?: string) {
  return useQuery({
    queryKey: ["preview-daily-report", dailyReportId],
    queryFn: () => getDailyReportBoxes(dailyReportId!),
    enabled: !!dailyReportId,
  })
}

export function useAddDailyReport() {
  const query = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ["add-daily-report"],
    mutationFn: (data: AddDailyReport) => addDailyReport(data),
    onSuccess: () => {
      useModalStore.getState().closeModal("modal-create-daily-report")
      query.invalidateQueries({ queryKey: ["boxes"], exact: false })
      toast.success("Parte diario creado exitosamente")
      navigate({ to: Routes.DailyReport })
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}

export function useCloseDailyReport() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["close-daily-report"],
    mutationFn: (dailyReportId: string) => closeDailyReport(dailyReportId),
    onSuccess: () => {
      useModalStore.getState().closeModal("modal-close-daily-report")
      query.invalidateQueries({ queryKey: ["daily-reports"] })
      toast.success("Parte diario cerrado exitosamente")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}
