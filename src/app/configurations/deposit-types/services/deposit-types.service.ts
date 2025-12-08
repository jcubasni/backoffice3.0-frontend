import { fetchData } from "@/shared/lib/fetch-data"
import {
  AddDepositTypeDTO,
  DepositTypeResponse,
  DepositTypeState,
} from "../types/deposit-types.type"

export const getDepositTypes = async (): Promise<DepositTypeResponse[]> => {
  const response = await fetchData<DepositTypeResponse[]>({
    url: "/deposit-types",
  })
  return response
}

export const updateDepositTypeState = async (
  body: DepositTypeState[],
): Promise<void> => {
  return await fetchData<void>({
    url: "/deposit-types/status",
    method: "PATCH",
    body,
  })
}

// NOTE: Configuracion del sistema
export const getDepositType = async (id: string): Promise<DepositTypeResponse> => {
  const response = await fetchData<DepositTypeResponse>({
    url: `/deposit-types/${id}`,
  })
  return response
}

export const addDepositType = async (
  body: AddDepositTypeDTO,
): Promise<DepositTypeResponse> => {
  const response = await fetchData<DepositTypeResponse>({
    url: "/deposit-types",
    method: "POST",
    body,
  })
  return response
}

export const deleteDepositType = async (id: string): Promise<void> => {
  await fetchData<void>({
    url: `/deposit-types/${id}`,
    method: "DELETE",
  })
}

export const editDepositType = async (
  id: string,
  body: Partial<AddDepositTypeDTO>,
): Promise<DepositTypeResponse> => {
  const response = await fetchData<DepositTypeResponse>({
    url: `/deposit-types/${id}`,
    method: "PATCH",
    body,
  })
  return response
}
