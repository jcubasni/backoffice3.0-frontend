import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CACHE_TIME } from "@/lib/utils"
import { useModalStore } from "@/shared/store/modal.store"
import {
  AddGroupSerieDTO,
  EditGroupSerieDTO,
} from "../schemas/group-serie.schema"
import {
  addGroupSerie,
  deleteGroupSerie,
  getAvailableGroupSeries,
  getGroupSeries,
  getGroupSerieTypes,
  updateGroupSerie,
} from "../services/group-serie.service"

export function useGetGroupSeries(localId?: string) {
  return useQuery({
    queryKey: ["settings", "group-series", localId],
    queryFn: () => getGroupSeries(localId!),
    enabled: !!localId,
  })
}

export function useGetGroupSerieTypes() {
  return useQuery({
    queryKey: ["settings", "group-serie", "types"],
    queryFn: getGroupSerieTypes,
    gcTime: CACHE_TIME,
  })
}

export function useGetAvailableGroupSeries(
  idDocument?: number,
  idLocal?: string,
) {
  return useQuery({
    queryKey: ["settings", "group-series", "available", idDocument, idLocal],
    queryFn: () => getAvailableGroupSeries(idDocument!, idLocal!),
    enabled: !!idDocument && !!idLocal,
  })
}

export function useAddGroupSerie() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AddGroupSerieDTO) => addGroupSerie(data),
    onSuccess: () => {
      useModalStore.getState().closeModal("modal-add-group-serie")
      toast.success("Grupo serie creado exitosamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "group-series"] })
    },
  })
}

export function useUpdateGroupSerie() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditGroupSerieDTO }) =>
      updateGroupSerie(id, data),
    onSuccess: () => {
      useModalStore.getState().closeModal("modal-edit-group-serie")
      toast.success("Grupo serie actualizado exitosamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "group-series"] })
    },
  })
}

export function useDeleteGroupSerie() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ localId, groupId }: { localId: string; groupId: string }) =>
      deleteGroupSerie(localId, groupId),
    onSuccess: () => {
      useModalStore.getState().closeModal("modal-delete-group-serie")
      toast.success("Grupo serie eliminado exitosamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "group-series"] })
    },
  })
}
