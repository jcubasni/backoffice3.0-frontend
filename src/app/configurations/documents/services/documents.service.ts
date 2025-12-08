import { fetchData } from "@/shared/lib/fetch-data"
import {
  AddDocumentDTO,
  DocumentResponse,
  UpdateDocumentState,
} from "../types/documents.type"

export const getDocuments = async (): Promise<DocumentResponse[]> => {
  const response = await fetchData<DocumentResponse[]>({
    url: "/sale-document-type",
  })
  return response
}

export const getDocumentsActive = async (): Promise<DocumentResponse[]> => {
  const response = await fetchData<DocumentResponse[]>({
    url: "/sale-document-type/active",
  })
  return response
}

export const getDocumentsForSale = async (): Promise<DocumentResponse[]> => {
  const response = await fetchData<DocumentResponse[]>({
    url: "/sale-document-type/for-sale",
  })
  return response
}

export const updateDocumentState = async (
  body: UpdateDocumentState[],
): Promise<void> => {
  return await fetchData<void>({
    url: "/sale-document-type",
    method: "PATCH",
    body,
  })
}

// no utilizado
export const getDocument = async (id: string): Promise<DocumentResponse> => {
  const response = await fetchData<DocumentResponse>({
    url: `/sale-document-type/${id}`,
  })
  return response
}

export const addDocument = async (body: AddDocumentDTO) => {
  const response = await fetchData({
    url: "/sale-document-type",
    method: "POST",
    body,
  })
  return response
}

export const deleteDocument = async (id: string) => {
  await fetchData<void>({
    url: `/sale-document-type/${id}`,
    method: "DELETE",
  })
}

export const editDocument = async (
  id: string,
  body: Partial<AddDocumentDTO>,
): Promise<DocumentResponse> => {
  const response = await fetchData<DocumentResponse>({
    url: `/sale-document-type/${id}`,
    method: "PATCH",
    body,
  })
  return response
}

export const getDocumentsForNotes = async (): Promise<DocumentResponse[]> => {
  const response = await fetchData<DocumentResponse[]>({
    url: "/sale-document-type/notes/documents",
  })
  return response
}

export const getNotesDocuments = async (): Promise<DocumentResponse[]> => {
  const response = await fetchData<DocumentResponse[]>({
    url: "/sale-document-type/notes",
  })
  return response
}
