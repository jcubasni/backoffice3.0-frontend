import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CACHE_TIME } from "@/lib/utils"
import { useModalStore } from "@/shared/store/modal.store"
import {
  addDocument,
  deleteDocument,
  editDocument,
  getDocument,
  getDocuments,
  getDocumentsActive,
  getDocumentsForNotes,
  getDocumentsForSale,
  getNotesDocuments,
  updateDocumentState,
} from "../services/documents.service"
import { AddDocumentDTO, UpdateDocumentState } from "../types/documents.type"

export function useGetDocuments() {
  return useQuery({
    queryKey: ["settings", "documents"],
    queryFn: getDocuments,
    gcTime: CACHE_TIME,
  })
}

export function useGetDocumentsActive() {
  return useQuery({
    queryKey: ["settings", "documents", "active"],
    queryFn: getDocumentsActive,
    gcTime: CACHE_TIME,
  })
}

export function useGetDocumentsForSale() {
  return useQuery({
    queryKey: ["settings", "documents", "for-sale"],
    queryFn: getDocumentsForSale,
    gcTime: CACHE_TIME,
  })
}

export function useUpdateDocumentState() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["update-document-state"],
    mutationFn: (body: UpdateDocumentState[]) => updateDocumentState(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "documents"] })
      toast.success("Documentos actualizados correctamente")
    },
  })
}

// no utilizado
export function useGetDocument(id: string) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => getDocument(id),
  })
}

export function useAddDocument() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["add-document"],
    mutationFn: (data: AddDocumentDTO) => addDocument(data),
    onSuccess: () => {
      toast.success("Documento registrado correctamente")
      query.invalidateQueries({ queryKey: ["settings", "documents"] })
      useModalStore.getState().closeModal("modal-add-document")
    },
  })
}

export function useDeleteDocument() {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["delete-document"],
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      toast.success("Documento eliminado correctamente")
      query.invalidateQueries({ queryKey: ["settings", "documents"] })
      useModalStore.getState().closeModal("modal-delete-document")
    },
  })
}

export const useEditDocument = () => {
  const query = useQueryClient()
  return useMutation({
    mutationKey: ["edit-document"],
    mutationFn: ({ id, body }: { id: string; body: Partial<AddDocumentDTO> }) =>
      editDocument(id, body),
    onSuccess: () => {
      toast.success("Documento actualizado correctamente")
      query.invalidateQueries({ queryKey: ["settings", "documents"] })
      useModalStore.getState().closeModal("modal-edit-document")
    },
  })
}

export const useGetDocumentsForBillingNotes = (enabled: boolean) => {
  return useQuery({
    queryKey: ["settings", "documents", "for-notes"],
    queryFn: getDocumentsForNotes,
    gcTime: CACHE_TIME,
    enabled,
  })
}

export const useGetNotesDocuments = () => {
  return useQuery({
    queryKey: ["settings", "notes"],
    queryFn: getNotesDocuments,
    gcTime: CACHE_TIME,
  })
}
