import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addSide,
  deleteSide,
  getProductOptions,
  getSides,
  updateHose,
} from "../services/sides.service"
import { AddSideDTO } from "../types/sides.type"

export function useGetSides(localId?: string) {
  return useQuery({
    queryKey: ["settings", "sides", localId],
    queryFn: () => getSides(localId!),
    enabled: !!localId,
  })
}

export function useAddSide() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["add-side"],
    mutationFn: (data: AddSideDTO) => addSide(data),
    onSuccess: () => {
      toast.success("Lado registrado correctamente")
      queryClient.invalidateQueries({ queryKey: ["sides"] })
      useModalStore.getState().closeModal("modal-add-side")
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al agregar el lado")
    },
  })
}

export function useDeleteSide() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["delete-side"],
    mutationFn: (id: string) => deleteSide(id),
    onSuccess: () => {
      toast.success("Lado eliminado correctamente ✅")
      queryClient.invalidateQueries({ queryKey: ["sides"] })
      useModalStore.getState().closeModal("modal-delete-side")
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el lado")
    },
  })
}

export function useUpdateHose() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["update-hose"],
    mutationFn: ({ id, productId }: { id: string; productId: string | null }) =>
      updateHose(id, productId),
    onSuccess: () => {
      toast.success("Producto actualizado ✅")
      queryClient.invalidateQueries({ queryKey: ["sides"] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar producto")
    },
  })
}

export function useGetProductsOptions() {
  return useQuery({
    queryKey: ["products-options"],
    queryFn: getProductOptions,
    gcTime: 0,
  })
}

export function useUpdateMultipleHoses() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["update-multiple-hoses"],
    mutationFn: (data: { id: string; productId: string | null }[]) =>
      Promise.all(data.map(({ id, productId }) => updateHose(id, productId))),
    onSuccess: () => {
      toast.success("Todos los productos fueron actualizados ✅")
      queryClient.invalidateQueries({ queryKey: ["sides"] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar productos")
    },
  })
}
