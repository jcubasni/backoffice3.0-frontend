export type DocumentTypeResponse = {
  id?: number
  name: string
}

/**
 * Dirección del cliente tal como viene del backend en GET /clients
 */
export type UbigeoRef = {
  id: string
  name: string
}

export type ClientAddressResponse = {
  id: string
  addressLine1: string
  addressLine2: string | null
  reference: string | null

  province: UbigeoRef | null
  department: UbigeoRef | null
  district: UbigeoRef | null

  countryCode: string | null
  isPrimary: boolean
}

/**
 * Cliente tal como viene del backend en GET /clients
 */
export type ClientResponse = {
  id: string
  firstName: string
  lastName?: string | null
  email?: string | null
  phoneNumber?: string | null
  clientCode?: string | null
  documentNumber: string
  documentType: DocumentTypeResponse
  addresses: ClientAddressResponse[]
}

// Información base del usuario/persona
export type PersonInfo = {
  documentNumber: string
  firstName: string
  lastName?: string
}

// Representa la información básica de un cliente
export type ClientInfo = PersonInfo & {
  documentTypeId: number
  address?: string
}

// Información del usuario obtenida al buscar por documento
export type UserInfo = PersonInfo & {
  personType: string
  fiscalAddress?: string
  ubigeo: string | null
}

export type ClientSearch = Omit<ClientInfo, "address"> & {
  id: string
  isCredit: boolean
  has_retention: boolean
  has_perception: boolean
}

// Estructura para clientes con línea de crédito, extiende ClientBase y agrega campos de crédito
export type AccountDataDTO = {
  creditLine: number
  balance: number
  billingDays: number
  creditDays: number
  installments: number
  startDate: string
  endDate: string
}

// Tipo que representa un tipo de cuenta
export type AccountType = {
  id: number
  name: string
  description: string
  code: string
}

export type SearchClientParams = {
  saleDocumentTypeId: number
  searchTerm: string
  paymentTypeId: number
}

export type UpdateProductsByClient = {
  add?: number[]
  remove?: number[]
}

export type UpdateProductsParams = {
  accountId: string
  body: UpdateProductsByClient
}

export type AccountResponse = {
  accountId: string
  documentType: DocumentTypeResponse
  creditDays: number
  creditLine: number
  installments: number
  balance: number
  documentNumber: string
  clientName: string
  address: string
  // 👇 así viene en el backend
  type: {
    id: number
    description: string
  }
  status: boolean
  startDate: string
  endDate: string
  billingDays?: number
}

// 👉 Tipos de cuenta que devuelve el backend (GET /accounts/types)
export type AccountTypeResponse = {
  id: number
  name: string
  code: string
  description?: string | null
}

// 👉 Body para crear una cuenta (POST /accounts)
export type AccountCreateDTO = {
  clientId: string
  accountTypeId: number
  creditLine: number
  creditDays: number
  billingDays: number
  installments: number
  startDate: string
  endDate: string
  status?: boolean
}

// 👉 Body para actualizar una cuenta (PATCH /accounts/:id)
export type AccountUpdateDTO = {
  creditLine?: number
  creditDays?: number
  billingDays?: number
  installments?: number
  startDate?: string
  endDate?: string
}


export enum AccountTypeForClient {
  CREDIT = 200002,
  ANTICIPO = 200003,
  CANJE = 200004,
}

type ClientAccountConfigDto = {
  accountTypeId: number
  accountData?: AccountDataDTO // Obligatorio solo cuando accountTypeId === 1 (CREDIT)
}

type AccountTypeCard = {
  accountTypeId: number
  cardNumber: string
  balance: number
  productIds?: number[]
}

type VehicleCardDto = {
  licensePlate: string
  vehicleType: number
  model?: string
  tankCapacity?: number
  numberOfWheels?: number
  initialKilometrage?: number
  accountsType?: AccountTypeCard[]
}

/**
 * DTO para crear cliente + cuentas + vehículos (POST /accounts)
 */
export type ClientDTO = {
  // Datos del cliente (heredados de ClientAccountWithVehiclesDto)
  documentTypeId: number
  documentNumber: string
  firstName: string
  lastName?: string
  address?: string
  districtId?: string
  email?: string
  phone?: string
  clientCode?: string

  // Cuentas y vehículos
  accounts: ClientAccountConfigDto[]
  vehicles: VehicleCardDto[]
}

/**
 * DTO para actualizar cliente (PATCH /clients/:id)
 * Solo se mandan los campos que quieras editar.
 */
export type ClientUpdateDTO = {
  firstName?: string
  lastName?: string
  address?: string
  districtId?: string
  email?: string
  phone?: string
}

export type VehicleType = {
  id: number
  name: string
}
