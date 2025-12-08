import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addBankAccount,
  deleteBankAccount,
  editBankAccount,
  getBankAccounts,
  getBankAccountsByBankId,
  updateBankAccountState,
} from "../services/bank-accounts.service"
import {
  AddBankAccountDTO,
  BankAccount,
  UpdateBankAccountState,
} from "../types/bank-accounts.type"

export function useGetBankAccounts() {
  return useQuery<BankAccount[]>({
    queryKey: ["settings", "bank-accounts"],
    queryFn: getBankAccounts,
    gcTime: 0,
  })
}

export function useGetBankAccountsByBankId(id: number) {
  return useQuery<BankAccount[]>({
    queryKey: ["settings", "bank-accounts", id],
    queryFn: () => getBankAccountsByBankId(id),
    gcTime: 0,
    enabled: !!id,
  })
}

export function useUpdateBankAccountState() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["update-bank-account-state"],
    mutationFn: (body: UpdateBankAccountState[]) =>
      updateBankAccountState(body),
    onSuccess: () => {
      toast.success("Estado actualizado correctamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "bank-accounts"] })
    },
  })
}

export function useAddBankAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["add-bank-account"],
    mutationFn: (data: AddBankAccountDTO) => addBankAccount(data),
    onSuccess: () => {
      toast.success("Cuenta bancaria registrada correctamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "bank-accounts"] })
      useModalStore.getState().closeModal("modal-add-bank-account")
    },
  })
}

export function useEditBankAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["edit-bank-account"],
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Partial<AddBankAccountDTO>
    }) => editBankAccount(id, body),
    onSuccess: () => {
      toast.success("Cuenta bancaria actualizada correctamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "bank-accounts"] })
      useModalStore.getState().closeModal("modal-edit-bank-account")
    },
  })
}

export function useDeleteBankAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["delete-bank-account"],
    mutationFn: (id: string) => deleteBankAccount(id),
    onSuccess: () => {
      toast.success("Cuenta bancaria eliminada correctamente")
      queryClient.invalidateQueries({ queryKey: ["settings", "bank-accounts"] })
    },
  })
}
