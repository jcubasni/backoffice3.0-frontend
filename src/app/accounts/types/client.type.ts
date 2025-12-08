export type DocumentTypeResponse = {
  id?: number
  name: string
}

export type ClientResponse = {
  firstName: string
  lastName?: string
  email?: string
  phoneNumber?: string
  clientCode?: string
  documentNumber: string
  documentType: DocumentTypeResponse
  accounts: Array<AccountResponse>
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

// Estructura base para un cliente, incluye información del cliente y tipo de cuenta
// export type ClientBaseDTO = {
//   client: ClientInfo
//   accountTypeId: number
//   accountData?: AccountDataDTO
// }

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
  accountType: string
  status: boolean
  startDate: string
  endDate: string
  billingDays?: number
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

export type ClientDTO = {
  // Datos del cliente (heredados de ClientAccountWithVehiclesDto)
  documentTypeId: number
  documentNumber: string
  firstName: string
  lastName?: string
  address?: string
  department?: string
  province?: string
  district?: string
  email?: string
  phone?: string
  clientCode?: string

  // Cuentas y vehículos
  accounts: ClientAccountConfigDto[]
  vehicles: VehicleCardDto[]
}

export type VehicleType = {
  id: number
  name: string
}
