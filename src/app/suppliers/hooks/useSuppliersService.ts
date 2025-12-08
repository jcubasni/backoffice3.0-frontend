import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useModalStore } from "@/shared/store/modal.store"
import { Modals } from "../types/modals-name"
import { addSupplier, getSuppliers } from "../services/suppliers.service"
import { CreateSupplierSchema } from "../schemas/create-supplier.schema"

export function useGetSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  })
}

export function useAddSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["add-supplier"],
    mutationFn: (data: CreateSupplierSchema) => addSupplier(data),
    onSuccess: () => {
      toast.success("Proveedor registrado correctamente")
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      useModalStore.getState().closeModal(Modals.ADD_SUPPLIER)
    },
  })
}
