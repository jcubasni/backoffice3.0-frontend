// usePlatesServicec.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import { ErrorResponse } from "@/shared/errors/error-response"

import {
  addPlates,
  assignPlateBalance, // ✅ NUEVO
  editPlate,
  getPlates,
  searchPlateByClientId,
} from "../services/plates.service"

import { Modals } from "../types/modals-name"
import type { AddPlateDTO, EditPlateDTO } from "../types/plate.type"

export function useGetPlates(accountId?: string) {
  return useQuery({
    queryKey: ["plates", "by-account", accountId],
    queryFn: () => getPlates(accountId!),
    enabled: !!accountId,
  })
}

export function useAddPlates(accountId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["add-plates", accountId],
    mutationFn: (body: AddPlateDTO) => {
      if (!accountId) throw new Error("accountId es obligatorio para crear tarjetas")
      return addPlates(accountId, body)
    },
    onSuccess: () => {
      toast.success("Se agregaron las placas correctamente")
      useModalStore.getState().closeModal(Modals.ADD_PLATE)

      queryClient.invalidateQueries({
        queryKey: ["plates"],
        exact: false,
      })
    },
    onError: (err: any) => {
      const msg =
        err instanceof ErrorResponse ? err.message : "No se pudieron agregar las placas"
      toast.error(msg)
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
      useModalStore.getState().closeModal(Modals.UPDATE_BALANCE)

      queryClient.invalidateQueries({
        queryKey: ["plates"],
        exact: false,
      })
    },
    onError: (err: any) => {
      const msg =
        err instanceof ErrorResponse ? err.message : "No se pudo actualizar la placa"
      toast.error(msg)
    },
  })
}

/* -------------------------------------------
 * ✅ AGREGAR SALDO INCREMENTAL A TARJETA
 * POST /accounts/cards/:accountCardId/assign-balance
 * body: { amount, note? }
 * ---------------------------------------- */
export function useAssignPlateBalance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["assign-plate-balance"],
    mutationFn: ({
      accountCardId,
      body,
    }: {
      accountCardId: string
      body: { amount: number; note?: string }
    }) => assignPlateBalance(accountCardId, body),

    onSuccess: () => {
      toast.success("Saldo agregado correctamente")
      useModalStore.getState().closeModal(Modals.UPDATE_BALANCE)

      queryClient.invalidateQueries({
        queryKey: ["plates"],
        exact: false,
      })
    },

    onError: (err: any) => {
      const msg =
        err instanceof ErrorResponse
          ? err.message
          : err?.message ?? "No se pudo agregar el saldo"
      toast.error(msg)
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
