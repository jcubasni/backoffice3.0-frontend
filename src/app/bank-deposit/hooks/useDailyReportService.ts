import {
  addReportsToDeposit,
  deleteReportFromDeposit,
  getAvailableReports,
  getSelectedReports,
} from "@bank-deposit/services/daily-report.service"
import {
  AddReportsToDeposit,
  DeleteReportFromDeposit,
} from "@bank-deposit/types/daily-report.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"

export function useGetAvailableReports() {
  return useQuery({
    queryKey: ["daily-reports-for-bank"],
    queryFn: getAvailableReports,
  })
}

export function useGetSelectedReports(id: string) {
  return useQuery({
    queryKey: ["selected-reports", id],
    queryFn: () => getSelectedReports(id),
    enabled: !!id,
  })
}

export function useAddReportsToDeposit() {
  const query = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ["add-daily-reports-to-bank"],
    mutationFn: (params: AddReportsToDeposit) => addReportsToDeposit(params),
    onSuccess: () => {
      toast.success("Se agregaron los reportes")
      query.invalidateQueries({ queryKey: ["daily-reports-for-bank"] })
      navigate({ to: Routes.BankDeposit })
    },
  })
}

export const useDeleteReportFromDeposit = () => {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["delete-daily-report-from-bank"],
    mutationFn: (params: DeleteReportFromDeposit) =>
      deleteReportFromDeposit(params),
    onSuccess: () => {
      toast.success("Se eliminó el reporte del banco")
      query.invalidateQueries({ queryKey: ["selected-reports"], exact: false })
      useModalStore.getState().closeModal("modal-delete-daily-report")
    },
  })
}
