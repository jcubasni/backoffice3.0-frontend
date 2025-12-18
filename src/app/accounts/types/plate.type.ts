import { PersonInfo } from "./client.type"

/** Tipo de tarjeta (catálogo del backend) */
export enum CardType {
  INTERNO = 8,
  GENERAL = 10,
}

/** Estado de la tarjeta (catálogo del backend) */
export enum CardStatus {
  ACTIVE = 40001, // backend: ACTIVO
  INACTIVE = 40002, // backend: INACTIVO
}

type ClientResponse = Pick<PersonInfo, "firstName" | "lastName"> & {
  fullName: string
}

type VehicleResponse = {
  id?: string
  plate: string
}

type ProductResponse = {
  id: number
  name: string
}

/** Tarjeta tal como viene del backend en GET /accounts/cards/... */
export type CardResponse = {
  accountCardId: string
  client: ClientResponse
  vehicle?: VehicleResponse
  balance: number
  cardNumber: string
  products: ProductResponse[]
  status: CardStatus
}

/** Body de cada tarjeta en el POST /accounts/cards/{accountId} */
export type CardCreateDTO = {
  licensePlate: string
  cardNumber: string
  balance: number
  productIds: number[]
}

export type AddPlateDTO = {
  cards: CardCreateDTO[]
}

/** DTO para actualizar una tarjeta (PATCH /accounts/cards/:accountCardId) */
export type EditPlateDTO = {
  accountCardId: string
  body: {
    balance: number
  }
}

/** DTO para agregar saldo incremental (POST /accounts/cards/:id/assign-balance) */
export type AssignPlateBalanceDTO = {
  accountCardId: string
  body: {
    amount: number
    note?: string
  }
}
