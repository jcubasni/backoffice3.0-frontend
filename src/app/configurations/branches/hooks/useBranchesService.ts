import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CACHE_TIME } from "@/lib/utils"
import { useModalStore } from "@/shared/store/modal.store"
import {
  deleteBranch,
  editBranch,
  getBranches,
  postBranch,
} from "../services/branches.service"
import { AddBranchDTO, Branch } from "../types/branches.type"

export function useGetBranches() {
  return useQuery<Branch[]>({
    queryKey: ["branches"],
    queryFn: getBranches,
    gcTime: CACHE_TIME,
  })
}

export function useAddBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["add-branch"],
    mutationFn: (data: AddBranchDTO) => postBranch(data),
    onSuccess: () => {
      toast.success("Sede registrada correctamente")
      queryClient.invalidateQueries({ queryKey: ["branches"] })
      useModalStore.getState().closeModal("modal-add-branch")
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al agregar la sede")
    },
  })
}

export function useEditBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["edit-branch"],
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      editBranch(id, body),
    onSuccess: () => {
      toast.success("Sede actualizada correctamente")
      queryClient.invalidateQueries({ queryKey: ["branches"] })
      useModalStore.getState().closeModal("modal-edit-branch")
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al editar la sede")
    },
  })
}

export function useDeleteBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["delete-branch"],
    mutationFn: (id: string) => deleteBranch(id),
    onSuccess: () => {
      toast.success("Sede eliminada correctamente")
      queryClient.invalidateQueries({ queryKey: ["branches"] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar la sede")
    },
  })
}
