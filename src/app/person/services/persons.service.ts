import { fetchData } from "@/shared/lib/fetch-data"

export type PersonByDocumentResponse = {
  documentNumber: string
  documentTypeId: number
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  isExternal?: boolean
  address?: {
    addressLine1?: string | null
    districtId?: string | null
  } | null
}

export type SearchPersonByDocumentParams = {
  documentTypeId: number
  document: string
}

/** ✅ Busca persona por documento (BD, contexto local) */
export const getPersonByDocumentLocal = async (
  params: SearchPersonByDocumentParams,
): Promise<PersonByDocumentResponse> => {
  return fetchData<PersonByDocumentResponse>({
    url: "/persons/by-document/local",
    params,
  })
}

/** (Opcional) Global, si algún día lo necesitas */
export const getPersonByDocument = async (
  params: SearchPersonByDocumentParams,
): Promise<PersonByDocumentResponse> => {
  return fetchData<PersonByDocumentResponse>({
    url: "/persons/by-document",
    params,
  })
}
