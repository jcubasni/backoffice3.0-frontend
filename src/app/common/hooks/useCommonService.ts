import { useQuery } from "@tanstack/react-query"
import { CACHE_TIME } from "@/lib/utils"
import {
  getAccountTypes,
  getDocumentTypes,
  getDocumentTypesBySaleDocumentType,
  getPaymentTypes,
  getPaymentTypesBySaleDocument,
  searchClient,
} from "../services/common.service"
import {
  DocumentTypeCode,
  DocumentTypeInfo,
  SearchClientParams,
} from "../types/common.type"

export function useGetDocumentTypes() {
  return useQuery({
    queryKey: ["document", "types"],
    queryFn: getDocumentTypes,
    gcTime: CACHE_TIME,
  })
}

export function useSearchClient(params: SearchClientParams) {
  const { documentType, document } = params
  return useQuery({
    queryKey: ["search", "client", params],
    queryFn: () => searchClient(params),
    enabled:
      documentType !== DocumentTypeCode.CARNET_EXT &&
      !!document?.length &&
      document?.length === DocumentTypeInfo[documentType!].length,
  })
}

export function useGetAccountTypes() {
  return useQuery({
    queryKey: ["account", "types"],
    queryFn: getAccountTypes,
    gcTime: CACHE_TIME,
  })
}

export function useGetDocumentTypesBySaleDocumentType(
  saleDocumentType: number,
) {
  return useQuery({
    queryKey: ["document", "types", saleDocumentType],
    queryFn: () => getDocumentTypesBySaleDocumentType(saleDocumentType),
    gcTime: CACHE_TIME,
  })
}

export function useGetPaymentTypes() {
  return useQuery({
    queryKey: ["payment", "types"],
    queryFn: getPaymentTypes,
    gcTime: CACHE_TIME,
  })
}

export function useGetPaymentTypesBySaleDocumentType(
  saleDocumentTypeId: number,
) {
  return useQuery({
    queryKey: ["payment", "types", saleDocumentTypeId],
    queryFn: () => getPaymentTypesBySaleDocument(saleDocumentTypeId),
    enabled: !!saleDocumentTypeId,
    gcTime: CACHE_TIME,
  })
}
