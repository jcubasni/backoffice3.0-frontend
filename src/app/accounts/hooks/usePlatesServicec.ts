import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addPlates,
  editPlate,
  getPlates,
  searchPlateByClientId,
} from "../services/plates.service"
import { Modals } from "../types/modals-name"
import { AddPlateDTO, EditPlateDTO } from "../types/plate.type"

export function useGetPlates(accountId?: string) {
  return useQuery({
    queryKey: ["plates", accountId],
    queryFn: () => getPlates(accountId!),
    enabled: !!accountId,
  })
}

export function useAddPlates() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-plates"],
    mutationFn: (body: AddPlateDTO) => addPlates(body),
    onSuccess: () => {
      toast.success("Se agregaron las placas")
      useModalStore.getState().closeModal(Modals.ADD_PLATE)
      query.invalidateQueries({ queryKey: ["plates"], exact: false })
    },
  })
}

export function useEditPlate() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["edit-plate"],
    mutationFn: (data: EditPlateDTO) => editPlate(data),
    onSuccess: () => {
      toast.success("Se actualizó la placa")
      useModalStore.getState().closeModal("modal-update-balance")
      query.invalidateQueries({ queryKey: ["plates"], exact: false })
    },
  })
}

export function useSearchPlateByClientId(clientId?: string) {
  return useQuery({
    queryKey: ["plates", "by-client", clientId],
    queryFn: () => searchPlateByClientId(clientId!),
    enabled: !!clientId,
  })
}
