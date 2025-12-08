// src/app/configurations/currencies/services/currencies.service.ts

import { fetchData } from "@/shared/lib/fetch-data"
import { AddMaintenanceCurrencyDTO, Currency } from "../types/currencies.type"

export const getCurrencies = async (): Promise<Currency[]> => {
  const response = await fetchData<Currency[]>({
    url: "/currencies",
  })
  return response
}

export const getCurrency = async (id: string): Promise<Currency> => {
  const response = await fetchData<Currency>({
    url: `/currencies/${id}`,
  })
  return response
}

export const addCurrency = async (
  body: AddMaintenanceCurrencyDTO,
): Promise<Currency> => {
  const response = await fetchData<Currency>({
    url: "/currencies",
    method: "POST",
    body,
  })
  return response
}

export const deleteCurrency = async (id: string): Promise<void> => {
  await fetchData<void>({
    url: `/currencies/${id}`,
    method: "DELETE",
  })
}

export const patchCurrency = async (
  id: string,
  body: Partial<AddMaintenanceCurrencyDTO>,
): Promise<Currency> => {
  const response = await fetchData<Currency>({
    url: `/currencies/${id}`,
    method: "PATCH",
    body,
  })
  return response
}
