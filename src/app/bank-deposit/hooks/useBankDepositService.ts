import {
  addDeposit,
  deleteDeposit,
  editDeposit,
  getDeposit,
  getDeposits,
} from "@bank-deposit/services/bank-deposit.service"
import { AddDeposit, EditDeposit } from "@bank-deposit/types/bank-deposit.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"

export function useGetDeposits({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}) {
  return useQuery({
    queryKey: ["bank-deposits", startDate, endDate],
    queryFn: () => getDeposits({ startDate, endDate }),
  })
}

export function useGetDeposit(id: string) {
  return useQuery({
    queryKey: ["bank-deposit", id],
    queryFn: () => getDeposit(id),
  })
}

export function useAddDeposit() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-bank-deposit"],
    mutationFn: (data: AddDeposit) => addDeposit(data),
    onSuccess: () => {
      toast.success("Se agregaron los depósitos")
      query.invalidateQueries({ queryKey: ["bank-deposits"] })
      useModalStore.getState().closeModal("modal-add-bank-deposit")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}

export function useDeleteDeposit() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["delete-bank-deposit"],
    mutationFn: (id: string) => deleteDeposit(id),
    onSuccess: () => {
      toast.success("Se eliminó el depósito")
      query.invalidateQueries({ queryKey: ["bank-deposits"] })
      useModalStore.getState().closeModal("modal-delete-bank-deposit")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}

export const useEditDeposit = () => {
  return useMutation({
    mutationKey: ["edit-bank-deposit"],
    mutationFn: (params: EditDeposit) => editDeposit(params),
    onSuccess: () => {
      toast.success("Se editaron los datos del depósito")
      useModalStore.getState().closeModal("modal-edit-bank-deposit")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}
