// src/app/accounts/services/accounts.service.ts
import { fetchData } from "@/shared/lib/fetch-data"

import type {
  AccountCreateDTO,
  AccountResponse,
  AccountTypeResponse,
  AccountUpdateDTO,
} from "../types/client.type"

import type { CreateAccountsOnlyDTO } from "./clients.service" 
// 👆 OJO: por ahora lo importo desde donde ya lo tienes.
// En el siguiente paso lo movemos también, para que Accounts sea 100% independiente.

export const getAccountTypes = async (): Promise<AccountTypeResponse[]> => {
  return fetchData<AccountTypeResponse[]>({
    url: "/accounts/types",
  })
}

export const getAccountByClientId = async (clientId: string): Promise<AccountResponse[]> => {
  return fetchData<AccountResponse[]>({
    url: `/accounts/by-client/${clientId}`,
  })
}

export const createAccount = async (body: AccountCreateDTO): Promise<AccountResponse> => {
  return fetchData<AccountResponse>({
    url: "/accounts",
    method: "POST",
    body,
  })
}

export const createAccountsOnly = async (body: CreateAccountsOnlyDTO): Promise<AccountResponse[]> => {
  return fetchData<AccountResponse[]>({
    url: "/accounts/only",
    method: "POST",
    body,
  })
}

export const updateAccount = async (
  accountId: string,
  body: AccountUpdateDTO,
): Promise<AccountResponse> => {
  return fetchData<AccountResponse>({
    url: `/accounts/${accountId}`,
    method: "PATCH",
    body,
  })
}

export const getAccountByDocumentNumber = async (
  documentNumber: string,
  documentTypeId: number,
): Promise<AccountResponse> => {
  return fetchData<AccountResponse>({
    url: `/accounts/by-document`,
    params: { documentNumber, documentTypeId },
  })
}

export type AssignAccountBalanceDTO = {
  amount: number
  note?: string
}

export const assignAccountBalance = async (
  accountId: string,
  body: AssignAccountBalanceDTO,
): Promise<any> => {
  return fetchData<any>({
    url: `/accounts/${accountId}/assign-balance`,
    method: "POST",
    body,
  })
}
