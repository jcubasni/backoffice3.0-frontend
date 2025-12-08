import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addCurrency,
  deleteCurrency,
  getCurrencies,
  getCurrency,
  patchCurrency,
} from "../services/currencies.service"
import { AddMaintenanceCurrencyDTO } from "../types/currencies.type"

export function useGetCurrencies() {
  return useQuery({
    queryKey: ["settings", "currencies"],
    queryFn: getCurrencies,
    gcTime: 0,
  })
}

export function useGetCurrency(id: string) {
  return useQuery({
    queryKey: ["settings", "currency", id],
    queryFn: () => getCurrency(id),
  })
}

export function useAddCurrency() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-currency"],
    mutationFn: (data: AddMaintenanceCurrencyDTO) => addCurrency(data),
    onSuccess: () => {
      toast.success("Moneda registrada correctamente ✅")
      query.invalidateQueries({ queryKey: ["settings", "currencies"] })
      useModalStore.getState().closeModal("modal-add-currency")
    },
  })
}

export function useDeleteCurrency() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["delete-currency"],
    mutationFn: (id: string) => deleteCurrency(id),
    onSuccess: () => {
      toast.success("Moneda eliminada correctamente ✅")
      query.invalidateQueries({ queryKey: ["settings", "currencies"] })
      useModalStore.getState().closeModal("modal-delete-currency")
    },
  })
}

export const useEditCurrency = () => {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["edit-currency"],
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Partial<AddMaintenanceCurrencyDTO>
    }) => patchCurrency(id, body),
    onSuccess: () => {
      toast.success("Moneda actualizada correctamente ✅")
      query.invalidateQueries({ queryKey: ["settings", "currencies"] })
      useModalStore.getState().closeModal("modal-edit-currency")
    },
  })
}
