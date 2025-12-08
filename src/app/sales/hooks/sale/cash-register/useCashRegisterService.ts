import {
  getHasOpen,
  openCashRegister,
} from "@sales/service/cash-register.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useHasOpen() {
  return useQuery({
    queryKey: ["cash-register", "has-open"],
    queryFn: () => getHasOpen(),
  })
}

export function useOpenCashRegister() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["cash-register", "open"],
    mutationFn: () => openCashRegister(),
    onSuccess: () => {
      toast.dismiss()
      toast.success("Caja abierta exitosamente")
      query.invalidateQueries({ queryKey: ["cash-register", "has-open"] })
    },
  })
}
