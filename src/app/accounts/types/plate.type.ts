import { PersonInfo } from "./client.type"

/** Tipo de tarjeta (catálogo del backend) */
export enum CardType {
  INTERNO = 8,
  GENERAL = 10,
}

/** Estado de la tarjeta (catálogo del backend) */
export enum CardStatus {
  ACTIVE = 40000,
  INACTIVE = 40001,
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
  products: ProductResponse[]   // 👈 en la respuesta viene "products"
  status: CardStatus            // 👈 usamos el enum de arriba
}

/** Body de cada tarjeta en el POST /accounts/cards/{accountId} */
// plate.type.ts

export type CardCreateDTO = {
  licensePlate: string
  cardNumber: string
  balance: number
  productIds: number[]
}

export type AddPlateDTO = {
  cards: CardCreateDTO[]
}


/** DTO para actualizar una tarjeta existente */
export type EditPlateDTO = {
  accountCardId: string
  body: Partial<{
    balance: number
  }>
}

