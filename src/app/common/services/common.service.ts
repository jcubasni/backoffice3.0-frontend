import { AccountType, UserInfo } from "@/app/accounts/types/client.type"
import { fetchData } from "@/shared/lib/fetch-data"
import {
  DocumentType,
  DocumentTypeInfo,
  PaymentType,
  SearchClientParams,
} from "../types/common.type"

export const getDocumentTypes = async (): Promise<DocumentType[]> => {
  const response = await fetchData<DocumentType[]>({
    url: "/clients/document-types",
  })
  return response
}

export const searchClient = async (
  params: SearchClientParams,
): Promise<UserInfo> => {
  const response = await fetchData<UserInfo>({
    url: "/clients/by-document",
    params: {
      ...params,
      documentType: DocumentTypeInfo[params.documentType!].code,
    },
  })
  return response
}

export const getAccountTypes = async (): Promise<AccountType[]> => {
  const response = await fetchData<AccountType[]>({
    url: "/accounts/types",
  })
  return response
}

export const getDocumentTypesBySaleDocumentType = async (
  saleDocumentType: number,
): Promise<DocumentType[]> => {
  const response = await fetchData<DocumentType[]>({
    url: `/document-types/${saleDocumentType}`,
  })
  return response
}

export const getPaymentTypes = async (): Promise<PaymentType[]> => {
  const response = await fetchData<PaymentType[]>({
    url: "/payment-types",
  })
  return response
}

export const getPaymentTypesBySaleDocument = async (
  saleDocumentTypeId: number,
): Promise<PaymentType[]> => {
  const response = await fetchData<PaymentType[]>({
    url: `/payment-types/${saleDocumentTypeId}`,
  })
  return response
}
