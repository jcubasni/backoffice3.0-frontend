import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useLoadStore } from "@/shared/store/load.store"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addDailyReportBox,
  deleteDailyReportBox,
  getBoxes,
} from "../services/boxes.service"
import {
  AddDailyReportBoxParams,
  BoxParams,
  DeleteDailyReportBoxParams,
} from "../types/boxes.type"

export function useGetBoxes(params: BoxParams) {
  return useQuery({
    queryKey: ["boxes", params],
    queryFn: () => getBoxes(params),
  })
}

export function useDeleteDailyReportBox() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["delete-daily-report-box"],
    mutationFn: (params: DeleteDailyReportBoxParams) =>
      deleteDailyReportBox(params),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["preview-daily-report"],
        exact: false,
      })
      query.invalidateQueries({ queryKey: ["daily-reports"] })
      toast.success("Caja eliminada exitosamente")
      useModalStore.getState().closeModal("modal-delete-daily-report-box")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}

export function useAddDailyReportBox() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-daily-report-box"],
    mutationFn: (params: AddDailyReportBoxParams) => addDailyReportBox(params),
    onSuccess: () => {
      useLoadStore.getState().setLoading(false)
      query.invalidateQueries({ queryKey: ["boxes"], exact: false })
      query.invalidateQueries({ queryKey: ["daily-reports"] })
      toast.success("Caja agregada exitosamente")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}
