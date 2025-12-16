// usePlatesServicec.ts
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
import type { AddPlateDTO, EditPlateDTO } from "../types/plate.type"

export function useGetPlates(accountId?: string) {
  return useQuery({
    queryKey: ["plates", "by-account", accountId],
    queryFn: () => getPlates(accountId!),   // solo se ejecuta si hay accountId
    enabled: !!accountId,
  })
}

// 👇 AQUÍ EL CAMBIO IMPORTANTE
export function useAddPlates(accountId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["add-plates", accountId],
    mutationFn: (body: AddPlateDTO) => {
      if (!accountId) {
        throw new Error("accountId es obligatorio para crear tarjetas")
      }
      // accountId va en la URL, body es { cards: [...] }
      return addPlates(accountId, body)
    },
    onSuccess: () => {
      toast.success("Se agregaron las placas correctamente")
      useModalStore.getState().closeModal(Modals.ADD_PLATE)

      // invalidamos listas de tarjetas
      queryClient.invalidateQueries({
        queryKey: ["plates"],
        exact: false,
      })
    },
    onError: () => {
      toast.error("No se pudieron agregar las placas")
    },
  })
}

export function useEditPlate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["edit-plate"],
    mutationFn: (data: EditPlateDTO) => editPlate(data),
    onSuccess: () => {
      toast.success("Se actualizó la placa correctamente")
      // mejor usar el enum/constante
      useModalStore.getState().closeModal(Modals.UPDATE_BALANCE)

      queryClient.invalidateQueries({
        queryKey: ["plates"],
        exact: false,
      })
    },
    onError: () => {
      toast.error("No se pudo actualizar la placa")
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
