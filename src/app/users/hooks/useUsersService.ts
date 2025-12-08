import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addUser,
  deleteUser,
  editUser,
  getUser,
  getUsers,
} from "../services/users.service"
import { AddUserDTO } from "../types/users.type"

export function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    gcTime: 0,
  })
}

export function useGetUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    gcTime: 0,
  })
}

export function useAddUser() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-user"],
    mutationFn: (data: AddUserDTO) => addUser(data),
    onSuccess: () => {
      toast.success("Usuario registrado correctamente ✅")
      query.invalidateQueries({ queryKey: ["users"] })
      useModalStore.getState().closeModal("modal-add-user")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}

export function useDeleteUser() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success("Usuario eliminado correctamente ✅")
      query.invalidateQueries({ queryKey: ["users"] })
      useModalStore.getState().closeModal("modal-delete-user")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}

export function useEditUser() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["edit-user"],
    mutationFn: ({ id, body }: { id: string; body: Partial<AddUserDTO> }) =>
      editUser(id, body),
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente ✅")
      query.invalidateQueries({ queryKey: ["users"] })
      useModalStore.getState().closeModal("modal-edit-user")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}
