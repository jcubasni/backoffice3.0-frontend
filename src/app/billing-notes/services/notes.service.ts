import { fetchData } from "@/shared/lib/fetch-data"
import { CreateCreditNoteDTO } from "../types/notes.dto"
import {
  DocumentShortParams,
  DocumentShortResponse,
  InstallmentResponse,
  NotesParams,
  NotesResponse,
  ReasonResponse,
} from "../types/notes.type"

export const getNotes = async (params: NotesParams) => {
  const response = await fetchData<NotesResponse[]>({
    url: "/credit-notes",
    params,
  })
  return response
}

export const getReasons = async (): Promise<ReasonResponse[]> => {
  const response = await fetchData<ReasonResponse[]>({
    url: "/credit-note/reasons",
  })
  return response
}

export const getBillingDocuments = async (
  params: DocumentShortParams,
): Promise<DocumentShortResponse[]> => {
  const response = await fetchData<DocumentShortResponse[]>({
    url: `/sales/billing-documents/client/${params.clientId}`,
    params,
  })
  return response
}

export const addNoteCredit = async (body: CreateCreditNoteDTO) => {
  const response = await fetchData<void>({
    url: "/credit-notes",
    method: "POST",
    body,
  })
  return response
}

export const getInstallments = async (documentId: string) => {
  const response = await fetchData<InstallmentResponse[]>({
    url: `/sales/${documentId}/installments`,
  })
  return response
}
