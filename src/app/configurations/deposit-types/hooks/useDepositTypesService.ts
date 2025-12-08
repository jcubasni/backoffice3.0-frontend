import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addDepositType,
  deleteDepositType,
  editDepositType,
  getDepositType,
  getDepositTypes,
} from "../services/deposit-types.service"
import { AddDepositTypeDTO } from "../types/deposit-types.type"

export function useGetDepositTypes() {
  return useQuery({
    queryKey: ["deposit-types"],
    queryFn: getDepositTypes,
    gcTime: 0,
  })
}

export function useGetDepositType(id: string) {
  return useQuery({
    queryKey: ["deposit-type", id],
    queryFn: () => getDepositType(id),
    gcTime: 0,
  })
}

export function useAddDepositType() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-deposit-type"],
    mutationFn: (data: AddDepositTypeDTO) => addDepositType(data),
    onSuccess: () => {
      toast.success("Tipo de depósito registrado correctamente ✅")
      query.invalidateQueries({ queryKey: ["deposit-types"] })
      useModalStore.getState().closeModal("modal-add-deposit-type")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}

export function useDeleteDepositType() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["delete-deposit-type"],
    mutationFn: (id: string) => deleteDepositType(id),
    onSuccess: () => {
      toast.success("Tipo de depósito eliminado correctamente ✅")
      query.invalidateQueries({ queryKey: ["deposit-types"] })
      useModalStore.getState().closeModal("modal-delete-deposit-type")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}

export const useEditDepositType = () => {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["edit-deposit-type"],
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Partial<AddDepositTypeDTO>
    }) => editDepositType(id, body),
    onSuccess: () => {
      toast.success("Tipo de depósito actualizado correctamente ✅")
      query.invalidateQueries({ queryKey: ["deposit-types"] })
      useModalStore.getState().closeModal("modal-edit-deposit-type")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}
