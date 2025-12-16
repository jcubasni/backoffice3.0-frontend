import { ProductResponse } from "@/app/products/types/product.type"
import { fetchData } from "@/shared/lib/fetch-data"

import type {
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

/** 📌 LISTAR CLIENTES (GET /clients) */
export const getClients = async (): Promise<ClientResponse[]> => {
  const response = await fetchData<ClientResponse[]>({
    url: "/clients",
  })
  return response
}

/** 📌 OBTENER CLIENTE POR ID (GET /clients/:clientId) */
export const getClientById = async (clientId: string): Promise<ClientResponse> => {
  const response = await fetchData<ClientResponse>({
    url: `/clients/${clientId}`,
  })
  return response
}

/** 📌 CREAR CLIENTE + CUENTAS + VEHÍCULOS (POST /accounts) */
export const addClient = async (body: ClientDTO): Promise<ClientResponse> => {
  const response = await fetchData<ClientResponse>({
    url: "/accounts",
    method: "POST",
    body,
  })
  return response
}

/** 🔄 ACTUALIZAR CLIENTE (PATCH /clients/:id) */
export const updateClient = async (clientId: string, body: ClientUpdateDTO) => {
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
export const getAccountByClientId = async (clientId: string): Promise<AccountResponse[]> => {
  const response = await fetchData<AccountResponse[]>({
    url: `/accounts/by-client/${clientId}`,
  })
  return response
}

/** 📌 CREAR CUENTA PARA UN CLIENTE (POST /accounts) */
export const createAccount = async (body: AccountCreateDTO): Promise<AccountResponse> => {
  const response = await fetchData<AccountResponse>({
    url: "/accounts",
    method: "POST",
    body,
  })
  return response
}

/** ✅ CREAR CUENTAS "ONLY" PARA UN CLIENTE (POST /accounts/only)
 *  - Sirve para crear 1, 2 o 3 cuentas (crédito/anticipo/canje) para un clientId
 *  - Crédito puede llevar campos extra (línea, días, fechas, etc.)
 *  - Anticipo / Canje pueden ir solo con accountTypeId
 */
export type AccountOnlyItemDTO = {
  accountTypeId: number
  creditLine?: number
  balance?: number
  billingDays?: number
  creditDays?: number
  installments?: number
  startDate?: string // "YYYY-MM-DD"
  endDate?: string // "YYYY-MM-DD"
}

export type CreateAccountsOnlyDTO = {
  clientId: string
  accounts: AccountOnlyItemDTO[]
}

export const createAccountsOnly = async (
  body: CreateAccountsOnlyDTO,
): Promise<AccountResponse[]> => {
  const response = await fetchData<AccountResponse[]>({
    url: "/accounts/only",
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
): Promise<AccountResponse> => {
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
    params: stock ? { stock } : undefined,
  })
  return response
}

/** 🔄 ACTUALIZAR PRODUCTOS POR CLIENTE EN UNA CUENTA (PATCH /accounts/:id/products) */
export const updateProductsByClient = async (accountId: string, body: UpdateProductsByClient) => {
  const response = await fetchData({
    url: `/accounts/${accountId}/products`,
    method: "PATCH",
    body,
  })
  return response
}

/* -------------------------------------------
 * 💳 TARJETAS DEL CLIENTE
 * ---------------------------------------- */

/** 📌 LISTAR TARJETAS POR CLIENTE (GET /accounts/cards/by-client/:clientId) */
export const getCardsByClientId = async (clientId: string): Promise<any> => {
  const response = await fetchData<any>({
    url: `/accounts/cards/by-client/${clientId}`,
  })
  return response
}

/** 📌 CREAR TARJETA PARA UNA CUENTA (POST /accounts/cards/:accountId) */
export const createCardForAccount = async (accountId: string, body: any): Promise<any> => {
  const response = await fetchData<any>({
    url: `/accounts/cards/${accountId}`,
    method: "POST",
    body,
  })
  return response
}

/** 🔄 ACTUALIZAR TARJETA (PATCH /accounts/cards/:cardId) */
export const updateCard = async (cardId: string, body: any): Promise<any> => {
  const response = await fetchData<any>({
    url: `/accounts/cards/${cardId}`,
    method: "PATCH",
    body,
  })
  return response
}

/** 💰 ASIGNAR SALDO A UNA TARJETA (POST /accounts/cards/:accountId/assign-balance) */
export const assignCardBalance = async (accountId: string, body: any): Promise<any> => {
  const response = await fetchData<any>({
    url: `/accounts/cards/${accountId}/assign-balance`,
    method: "POST",
    body,
  })
  return response
}
export type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}

export type CreateClientBody = {
  documentTypeId: number
  firstName: string
  documentNumber: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  address?: {
    addressLine1: string
    street?: string
    number?: string
    postalCode?: string
    districtId?: string
    reference?: string
  }
}

export const createClient = async (body: CreateClientBody): Promise<string> => {
  return fetchData<string>({
    url: "/clients",
    method: "POST",
    body,
  })
}

