import { fetchData } from "@/shared/lib/fetch-data"
import { AddMaintenanceBank } from "../schemas/bank.schema"
import { Bank, UpdateBankActive } from "../types/banks.type"

export const getBanks = async (): Promise<Bank[]> => {
  return await fetchData<Bank[]>({
    url: "/banks",
  })
}

export const getBanksActive = async (): Promise<Bank[]> => {
  return await fetchData<Bank[]>({
    url: "/banks/active",
  })
}

export const updateBankActive = async (
  body: UpdateBankActive[],
): Promise<void> => {
  return await fetchData<void>({
    url: "/banks",
    method: "PATCH",
    body,
  })
}

// No utilizado
export const postBank = async (body: AddMaintenanceBank): Promise<Bank> => {
  return await fetchData<Bank>({
    url: "/banks",
    method: "POST",
    body,
  })
}

export const editBank = async (
  id: string,
  body: Partial<AddMaintenanceBank> | { isActive: boolean },
): Promise<Bank> => {
  return await fetchData<Bank>({
    url: `/banks/${id}`,
    method: "PATCH",
    body,
  })
}
