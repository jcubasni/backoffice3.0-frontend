import { fetchData } from "@/shared/lib/fetch-data"
import {
  AddBankAccountDTO,
  BankAccount,
  UpdateBankAccountState,
} from "../types/bank-accounts.type"

export const getBankAccounts = async (): Promise<BankAccount[]> => {
  return await fetchData<BankAccount[]>({
    url: "/bank-accounts",
  })
}

export const getBankAccountsByBankId = async (
  id: number,
): Promise<BankAccount[]> => {
  return await fetchData<BankAccount[]>({
    url: `/bank-accounts/bank/${id}`,
  })
}

export const addBankAccount = async (
  body: AddBankAccountDTO,
): Promise<BankAccount> => {
  return await fetchData<BankAccount>({
    url: "/bank-accounts",
    method: "POST",
    body,
  })
}

export const updateBankAccountState = async (
  body: UpdateBankAccountState[],
): Promise<void> => {
  return await fetchData<void>({
    url: "/bank-accounts",
    method: "PATCH",
    body,
  })
}

export const editBankAccount = async (
  id: string,
  body: Partial<AddBankAccountDTO>,
): Promise<BankAccount> => {
  return await fetchData<BankAccount>({
    url: `/bank-accounts/${id}`,
    method: "PATCH",
    body,
  })
}

export const deleteBankAccount = async (id: string): Promise<void> => {
  await fetchData<void>({
    url: `/bank-accounts/${id}`,
    method: "DELETE",
  })
}
