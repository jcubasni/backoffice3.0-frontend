import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  editContometers,
  getContometersByReport,
} from "../services/contometer.service"
import { DetailContometer } from "../types/contometer.type"

export function useGetContometersByReport(id?: string) {
  return useQuery({
    queryKey: ["contometers", id],
    queryFn: () => getContometersByReport(id!),
    enabled: !!id,
  })
}

export function useEditContometers() {
  return useMutation({
    mutationKey: ["edit-contometers"],
    mutationFn: (data: DetailContometer[]) => editContometers(data),
    onSuccess: () => {
      toast.success("Se actualizó el contometro")
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })
}
