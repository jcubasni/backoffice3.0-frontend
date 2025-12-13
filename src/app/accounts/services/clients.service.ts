import { ProductResponse } from "@/app/products/types/product.type"
import { fetchData } from "@/shared/lib/fetch-data"
import {
  AccountResponse,
  AccountTypeResponse,
  AccountCreateDTO,
  AccountUpdateDTO,
  ClientDTO,
  ClientResponse,
  ClientSearch,
  SearchClientParams,
  UpdateProductsByClient,
  ClientUpdateDTO,
} from "../types/client.type"

/* -------------------------------------------
 * 👤 CLIENTES
 * ---------------------------------------- */

/** 📌 LISTAR CLIENTES (GET /clients)
 *  Lista simple de clientes.
 */
export const getClients = async (): Promise<ClientResponse[]> => {
  const response = await fetchData<ClientResponse[]>({
    url: "/clients",
  })
  return response
}

/** 📌 OBTENER CLIENTE POR ID (GET /clients/:clientId)
 *  Usado para cargar datos en el modal "Mis Datos".
 */
export const getClientById = async (
  clientId: string,
): Promise<ClientResponse> => {
  const response = await fetchData<ClientResponse>({
    url: `/clients/${clientId}`,
  })
  return response
}

/** 📌 CREAR CLIENTE + CUENTAS + VEHÍCULOS (POST /accounts)
 *  De momento seguimos usando el endpoint existente
 *  que recibe el DTO grande de ClientDTO.
 */
export const addClient = async (body: ClientDTO): Promise<ClientResponse> => {
  const response = await fetchData<ClientResponse>({
    url: "/accounts",
    method: "POST",
    body,
  })
  return response
}

/** 🔄 ACTUALIZAR CLIENTE (PATCH /clients/:id)
 *  Solo se envían los campos que se quieran editar (ClientUpdateDTO).
 */
export const updateClient = async (
  clientId: string,
  body: ClientUpdateDTO,
): Promise<any> => {
  const response = await fetchData<any>({
    url: `/clients/${clientId}`,
    method: "PATCH",
    body,
  })
  return response
}

/* -------------------------------------------
 * 🔎 BÚSQUEDA DE CLIENTES PARA VENTA
 * ---------------------------------------- */

/** 📌 BUSCAR CLIENTE POR TIPO DOC + TEXTO (GET /clients/search/sale-document) */
export const searchClientBySaleDocument = async (
  params: SearchClientParams,
): Promise<ClientSearch[]> => {
  const response = await fetchData<ClientSearch[]>({
    url: "/clients/search/sale-document",
    params,
  })
  return response
}

/* -------------------------------------------
 * 💳 CUENTAS DEL CLIENTE
 * ---------------------------------------- */

/** 📌 LISTAR TIPOS DE CUENTA (GET /accounts/types) */
export const getAccountTypes = async (): Promise<AccountTypeResponse[]> => {
  const response = await fetchData<AccountTypeResponse[]>({
    url: "/accounts/types",
  })
  return response
}

/** 📌 OBTENER CUENTAS POR CLIENTE (GET /accounts/by-client/:clientId) */
export const getAccountByClientId = async (
  clientId: string,
): Promise<AccountResponse[]> => {
  const response = await fetchData<AccountResponse[]>({
    url: `/accounts/by-client/${clientId}`,
  })
  return response
}

/** 📌 CREAR CUENTA PARA UN CLIENTE (POST /accounts) */
export const createAccount = async (
  body: AccountCreateDTO,
): Promise<AccountResponse> => {
  const response = await fetchData<AccountResponse>({
    url: "/accounts",
    method: "POST",
    body,
  })
  return response
}

/** 🔄 ACTUALIZAR CUENTA (PATCH /accounts/:accountId) */
export const updateAccount = async (
  accountId: string,
  body: AccountUpdateDTO,
): Promise<AccountResponse> => {
  const response = await fetchData<AccountResponse>({
    url: `/accounts/${accountId}`,
    method: "PATCH",
    body,
  })
  return response
}

/** 📌 OBTENER CUENTA POR DOCUMENTO (GET /accounts/by-document) */
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

/* -------------------------------------------
 * 🛒 PRODUCTOS POR CUENTA
 * ---------------------------------------- */

/** 📌 PRODUCTOS POR CUENTA (GET /accounts/:id/products) */
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

/** 🔄 ACTUALIZAR PRODUCTOS POR CLIENTE EN UNA CUENTA (PATCH /accounts/:id/products) */
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
