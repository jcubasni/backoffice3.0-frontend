import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  editBank,
  getBanks,
  getBanksActive,
  updateBankActive,
} from "../services/banks.service"
import { Bank, UpdateBankActive } from "../types/banks.type"

export function useGetBanks() {
  return useQuery<Bank[]>({
    queryKey: ["settings", "banks"],
    queryFn: getBanks,
    gcTime: 0,
  })
}

export function useGetBanksActive() {
  return useQuery<Bank[]>({
    queryKey: ["settings", "banks", "active"],
    queryFn: getBanksActive,
    gcTime: 0,
  })
}

export function useUpdateBankActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["update-bank-active"],
    mutationFn: (body: UpdateBankActive[]) => updateBankActive(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "banks"] })
      toast.success("Bancos actualizados correctamente")
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar bancos")
    },
  })
}

// no utilizado
export function useToggleBankStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["toggle-bank-status"],
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      editBank(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banks"] })
    },
    onError: () => {
      toast.error("Error al actualizar estado del banco")
    },
  })
}
