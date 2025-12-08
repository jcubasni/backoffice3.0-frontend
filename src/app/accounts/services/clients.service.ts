import { ProductResponse } from "@/app/products/types/product.type"
import { fetchData } from "@/shared/lib/fetch-data"
import {
  AccountResponse,
  ClientDTO,
  ClientResponse,
  ClientSearch,
  SearchClientParams,
  UpdateProductsByClient,
} from "../types/client.type"

export const getClients = async (): Promise<ClientResponse[]> => {
  const response = await fetchData<ClientResponse[]>({
    url: "/clients",
  })
  return response
}

// Antiguo version
// export const addClient = async (body: ClientBaseDTO): Promise<any> => {
export const addClient = async (body: ClientDTO): Promise<any> => {
  const response = await fetchData<any>({
    url: "/accounts",
    method: "POST",
    body,
  })
  return response
}

export const searchClientBySaleDocument = async (
  params: SearchClientParams,
): Promise<ClientSearch[]> => {
  const response = await fetchData<ClientSearch[]>({
    url: "/clients/search/sale-document",
    params,
  })
  return response
}

export const getProductsByAccount = async (
  accountId: string,
  stock?: 1,
): Promise<ProductResponse[]> => {
  const response = await fetchData<ProductResponse[]>({
    url: `/accounts/${accountId}/products`,
    params: {
      stock,
    },
  })
  return response
}

export const updateProductsByClient = async (
  accountId: string,
  body: UpdateProductsByClient,
) => {
  const response = await fetchData({
    url: `/accounts/${accountId}/products`,
    method: "PATCH",
    body,
  })
  return response
}

export const getAccountByClientId = async (clientId: string) => {
  const response = await fetchData<AccountResponse>({
    url: `/accounts/by-client/${clientId}`,
  })
  return response
}

export const getAccountByDocumentNumber = async (
  documentNumber: string,
  documentTypeId: number,
) => {
  const response = await fetchData<AccountResponse>({
    url: `/accounts/by-document`,
    params: {
      documentNumber,
      documentTypeId,
    },
  })
  return response
}
export const editClient = async (
  clientId: string,
  data: Record<string, any>,
) => {
  const response = await fetchData({
    url: `/accounts/${clientId}`,
    method: "PUT",
    body: data,
  })
  return response
}
