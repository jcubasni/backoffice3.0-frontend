import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { CACHE_TIME } from "@/lib/utils"
import {
  addNoteCredit,
  getBillingDocuments,
  getInstallments,
  getNotes,
  getReasons,
} from "../services/notes.service"
import { useProductStore } from "../store/product.store"
import type { CreateCreditNoteDTO } from "../types/notes.dto"
import { DocumentShortParams, NotesParams } from "../types/notes.type"

export function useGetNotes(params: NotesParams) {
  return useQuery({
    queryKey: ["notes", params],
    queryFn: () => getNotes(params),
    enabled: !!params.startDate,
  })
}

export function useGetReasons() {
  return useQuery({
    queryKey: ["notes", "reasons"],
    queryFn: getReasons,
    gcTime: CACHE_TIME,
  })
}

export function useGetBillingDocuments(params: DocumentShortParams) {
  return useQuery({
    queryKey: ["notes", "billing-documents", params],
    queryFn: () => getBillingDocuments(params),
    enabled: !!params.clientId,
    gcTime: CACHE_TIME,
  })
}

export function useAddNoteCredit() {
  const { resetProducts } = useProductStore()

  return useMutation({
    mutationKey: ["notes", "create-credit-note"],
    mutationFn: (data: CreateCreditNoteDTO) => addNoteCredit(data),
    onSuccess: () => {
      toast.success("Nota de crédito generada exitosamente")
      resetProducts()
    },
  })
}

export function useGetInstallments(documentId?: string) {
  return useQuery({
    queryKey: ["notes", "installments", documentId],
    queryFn: () => getInstallments(documentId!),
    enabled: !!documentId,
  })
}
