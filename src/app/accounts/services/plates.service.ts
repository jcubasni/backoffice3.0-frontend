// plates.service.ts
import { fetchData } from "@/shared/lib/fetch-data"
import { AddPlateDTO, CardResponse, EditPlateDTO } from "../types/plate.type"

export const getPlates = async (accountId: string): Promise<CardResponse[]> => {
  const response = await fetchData<CardResponse[]>({
    url: `/accounts/cards/by-account/${accountId}`,
  })
  return response
}

export const addPlates = async ({ accountId, cards }: AddPlateDTO) => {
  const response = await fetchData({
    url: `/accounts/cards/${accountId}`, // 👈 accountId en la URL
    method: "POST",
    body: { cards },                     // 👈 body igual al de Postman
  })
  return response
}

export const editPlate = async (data: EditPlateDTO) => {
  const { accountCardId, body } = data
  const response = await fetchData({
    url: `/accounts/cards/${accountCardId}`,
    method: "PATCH",
    body,
  })
  return response
}

export const searchPlateByClientId = async (
  clientId: string,
): Promise<CardResponse[]> => {
  const response = await fetchData<CardResponse[]>({
    url: `/accounts/cards/by-client/${clientId}`,
  })
  return response
}
