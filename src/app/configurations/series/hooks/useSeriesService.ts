import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addSeries,
  deleteSeries,
  editSeries,
  getSeries,
  getSeriesByUser,
  getSeriesWithoutGroup,
} from "../services/series.service"
import { AddSeriesDTO, EditSeriesDTO } from "../types/series.type"

export function useGetSeries() {
  return useQuery({
    queryKey: ["settings", "series"],
    queryFn: getSeries,
  })
}

export function useGetSeriesByUser(userId?: string, idDocument?: number) {
  return useQuery({
    queryKey: ["settings", "series", "by-user", userId, idDocument],
    queryFn: () => getSeriesByUser(userId!, idDocument),
    enabled: !!userId && !!idDocument,
  })
}

export function useGetSeriesWithoutGroup(localIds?: string[]) {
  return useQuery({
    queryKey: ["settings", "series", "without-group", localIds],
    queryFn: () => getSeriesWithoutGroup(localIds!),
    enabled: !!localIds?.length,
  })
}

export function useAddSeries() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["add-series"],
    mutationFn: (data: AddSeriesDTO) => addSeries(data),
    onSuccess: () => {
      toast.success("Serie registrada correctamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "series"] })
      useModalStore.getState().closeModal("modal-add-series")
    },
  })
}

export function useEditSeries() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["edit-series"],
    mutationFn: ({ id, body }: { id: string; body: EditSeriesDTO }) =>
      editSeries(id, body),
    onSuccess: () => {
      toast.success("Serie actualizada correctamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "series"] })
      useModalStore.getState().closeModal("modal-edit-series")
    },
  })
}

export function useDeleteSeries() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["delete-series"],
    mutationFn: (id: string) => deleteSeries(id),
    onSuccess: () => {
      toast.success("Serie eliminada correctamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "series"] })
      useModalStore.getState().closeModal("modal-delete-series")
    },
  })
}
