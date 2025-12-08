import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { editDipstick, getDipstick } from "../services/dipstick.service"
import { DetailDipstick } from "../types/dipstick.type"

export function useGetDipstick(id?: string) {
  return useQuery({
    queryKey: ["dipstick", id],
    queryFn: () => getDipstick(id!),
    enabled: !!id,
  })
}

export function useEditDipstick() {
  return useMutation({
    mutationKey: ["edit-dipstick"],
    mutationFn: (data: DetailDipstick[]) => editDipstick(data),
    onSuccess: () => {
      toast.success("Se actualizó el dipstick")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}
