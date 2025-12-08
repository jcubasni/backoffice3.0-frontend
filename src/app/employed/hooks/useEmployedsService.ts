import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"

import { getEmployeds, addEmployed, updateEmployed } from "../services/employeds.service"
import { EmployedDTO } from "../types/employed.type"
import { Modals } from "../types/modals-name"

export function useGetEmployeds() {
  return useQuery({
    queryKey: ["employeds"],
    queryFn: getEmployeds,
  })
}

export function useAddEmployed() {
  const query = useQueryClient()
  return useMutation({
    mutationFn: (params: EmployedDTO) => addEmployed(params),
    onSuccess: () => {
      toast.success("Empleado agregado (mock)")
      query.invalidateQueries({ queryKey: ["employeds"] })
      useModalStore.getState().closeModal(Modals.ADD_EMPLOYED)
    },
  })
}

export function useEditEmployed() {
  const query = useQueryClient()
  return useMutation({
    mutationFn: (params: EmployedDTO) => updateEmployed(params),
    onSuccess: () => {
      toast.success("Empleado actualizado (mock)")
      query.invalidateQueries({ queryKey: ["employeds"] })
      useModalStore.getState().closeModal(Modals.EDIT_EMPLOYED)
    },
  })
}
