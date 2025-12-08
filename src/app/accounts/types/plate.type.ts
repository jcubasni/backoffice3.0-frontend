import { PersonInfo } from "./client.type"

export enum CardType {
  INTERNO = 8,
  GENERAL = 10,
}

type ClientResponse = Pick<PersonInfo, "firstName" | "lastName"> & {
  fullName: string
}

type VehicleResponse = {
  plate: string
}

type ProductResponse = {
  id: number
  name: string
}

export type CardResponse = {
  accountCardId: string
  client: ClientResponse
  vehicle?: VehicleResponse
  balance: number
  cardNumber: string
  product: ProductResponse
  status: 1 | 0
}

export type PlateDTO = {
  accountId: string
  cardTypeId: number
  plate: string
  cardNumber: string
  balance: number
  productId: number
}

export type AddPlateDTO = {
  cards: PlateDTO[]
}

export type EditPlateDTO = {
  accountCardId: string
  body: Partial<PlateDTO>
}
