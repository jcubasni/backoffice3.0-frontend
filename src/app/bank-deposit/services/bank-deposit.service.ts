import { fetchData } from "@/shared/lib/fetch-data"
import {
  AddDeposit,
  Deposit,
  EditDeposit,
  PreviewDeposit,
} from "../types/bank-deposit.type"

export const getDeposits = async ({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}): Promise<Deposit[]> => {
  const response = await fetchData<Deposit[]>({
    url: "/bank-deposits",
    params: {
      startDate,
      endDate,
    },
  })
  return response
}

export const getDeposit = async (id: string): Promise<PreviewDeposit> => {
  const response = await fetchData<PreviewDeposit>({
    url: `/bank-deposits/${id}`,
  })
  return response
}

export const addDeposit = async (body: AddDeposit): Promise<any[]> => {
  const response = await fetchData<any[]>({
    url: "/bank-deposits",
    method: "POST",
    body,
  })
  return response
}

export const deleteDeposit = async (id: string): Promise<any> => {
  const response = await fetchData<any>({
    url: `/bank-deposits/${id}`,
    method: "DELETE",
  })
  return response
}

export const editDeposit = async (params: EditDeposit): Promise<any> => {
  const { id, observation } = params
  const response = await fetchData<any>({
    url: `/bank-deposits/${id}/observation`,
    method: "PATCH",
    body: {
      observation,
    },
  })
  return response
}
