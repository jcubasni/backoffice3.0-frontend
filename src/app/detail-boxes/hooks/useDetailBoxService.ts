import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useModalStore } from "@/shared/store/modal.store"
import {
  getDetailBox,
  getTotalsDetailBox,
  liquidatedDetailBox,
  preliquidatedDetailBox,
  saveDetailBox,
} from "../services/detail-box.service"
import { EditDetailBox } from "../types/detail-box.type"

export const useGetDetailBox = (cashRegisterId: string) => {
  return useQuery({
    queryKey: ["detail-box", cashRegisterId],
    queryFn: () => getDetailBox(cashRegisterId),
    enabled: Boolean(cashRegisterId),
  })
}

export const useGetTotalsDetailBox = (cashRegisterId: string) => {
  return useQuery({
    queryKey: ["totals-detail-box", cashRegisterId],
    queryFn: () => getTotalsDetailBox(cashRegisterId),
    enabled: !!cashRegisterId,
  })
}

// NOTE: Mutation for change state of detail box and update totals movements
const useDetailBoxMutation = <T = unknown>(
  mutationKey: string,
  mutationFn: (variables: T) => Promise<unknown>,
  successMessage: string,
  onSuccessCallback?: () => void,
) => {
  const query = useQueryClient()
  return useMutation({
    mutationKey: [mutationKey],
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage)
      query.invalidateQueries({ queryKey: ["detail-box"], exact: false })
      query.invalidateQueries({ queryKey: ["detail-boxes"], exact: false })
      onSuccessCallback?.()
    },
  })
}

export const usePreliquidatedDetailBox = () => {
  return useDetailBoxMutation(
    "preliquidated-detail-box",
    ({
      cashRegisterId,
      data,
    }: {
      cashRegisterId: string
      data: EditDetailBox
    }) => preliquidatedDetailBox(cashRegisterId, data),
    "Se ha guardado el detalle de caja",
  )
}

export const useSaveDetailBox = () => {
  return useDetailBoxMutation(
    "save-detail-box",
    ({
      cashRegisterId,
      data,
    }: {
      cashRegisterId: string
      data: EditDetailBox
    }) => saveDetailBox(cashRegisterId, data),
    "Se ha guardado el detalle de caja",
  )
}

export const useLiquidatedDetailBox = () => {
  return useDetailBoxMutation(
    "liquidated-detail-box",
    (cashRegisterId: string) => liquidatedDetailBox(cashRegisterId),
    "Se ha liquidado el detalle de caja",
    () => useModalStore.getState().closeModal("modal-detail-box"),
  )
}
