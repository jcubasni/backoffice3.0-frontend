import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CACHE_TIME } from "@/lib/utils"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addSale,
  getAntipatesByClientId,
  getDocumentByDocumentNumber,
  getProductsToSale,
  getSales,
  getSaleTypes,
} from "../../service/sale.service"
import { DateFilters, SaleDTO } from "../../types/sale"

export function useGetSales(filters: DateFilters) {
  return useQuery({
    queryKey: ["sales", filters],
    queryFn: () => getSales(filters),
    enabled: !!filters.startDate,
  })
}

export function useGetSaleTypes(saleDocumentType: number) {
  return useQuery({
    queryKey: ["sale-types", saleDocumentType],
    queryFn: () => getSaleTypes(saleDocumentType),
    enabled: !!saleDocumentType,
    gcTime: CACHE_TIME,
  })
}

export function useAddSale() {
  const query = useQueryClient()
  return useMutation({
    mutationFn: (dto: SaleDTO) => addSale(dto),
    onSuccess: () => {
      toast.success("Venta creada exitosamente")
      useModalStore.getState().closeModal("modal-payment")
      useModalStore.getState().closeModal("modal-installment")
      query.invalidateQueries({
        queryKey: ["products", "sale"],
      })
    },
  })
}

export function useGetProductsToSale() {
  return useQuery({
    queryKey: ["products", "sale"],
    queryFn: () => getProductsToSale(),
    enabled: true,
  })
}

export function useGetAntipatesByClientId(clientId?: string, term?: string) {
  return useQuery({
    queryKey: ["antipates", clientId, term],
    queryFn: () => getAntipatesByClientId(clientId!, term),
    enabled: !!clientId,
  })
}

export function useGetDocumentByDocumentNumber(documentNumber?: string) {
  return useQuery({
    queryKey: ["document", documentNumber],
    queryFn: () => getDocumentByDocumentNumber(documentNumber!),
    enabled: !!documentNumber,
  })
}
