// plates.service.ts
import { fetchData } from "@/shared/lib/fetch-data"
import type { AddPlateDTO, CardResponse, EditPlateDTO } from "../types/plate.type"

// 📌 Listar tarjetas por cuenta
export const getPlates = async (accountId: string): Promise<CardResponse[]> => {
  const response = await fetchData<CardResponse[]>({
    url: `/accounts/cards/by-account/${accountId}`,
  })
  return response
}

// 📌 Crear tarjetas para una cuenta
//    accountId va en la URL, y el body solo lleva { cards }
export const addPlates = async (
  accountId: string,
  { cards }: AddPlateDTO,
) => {
  const response = await fetchData({
    url: `/accounts/cards/${accountId}`, // 👈 accountId SOLO en la ruta
    method: "POST",
    body: { cards },                      // 👈 body igual que en Postman
  })

  return response
}

// 📌 Editar una tarjeta (ej. saldo)
export const editPlate = async (data: EditPlateDTO) => {
  const { accountCardId, body } = data

  const response = await fetchData({
    url: `/accounts/cards/${accountCardId}`,
    method: "PATCH",
    body,
  })

  return response
}

// 📌 Listar tarjetas por cliente
export const searchPlateByClientId = async (
  clientId: string,
): Promise<CardResponse[]> => {
  const response = await fetchData<CardResponse[]>({
    url: `/accounts/cards/by-client/${clientId}`,
  })
  return response
}
