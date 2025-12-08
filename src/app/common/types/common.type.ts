import { PaymentType as PaymentTypeEnum } from "@/app/sales/types/sale/sale.enum"

//types for validation in documentType and documentNumber
export type DocumentType = {
  id: number
  code: string
  name: string
}

export enum DocumentTypeCode {
  DNI = "3",
  RUC = "4",
  CARNET_EXT = "5",
}

export enum CodeSearch {
  DNI = "00001",
  RUC = "00002",
}

export const DocumentTypeInfo: Record<
  DocumentTypeCode,
  { label: string; length: number; code?: string }
> = {
  [DocumentTypeCode.DNI]: { label: "DNI", length: 8, code: CodeSearch.DNI },
  [DocumentTypeCode.RUC]: { label: "RUC", length: 11, code: CodeSearch.RUC },
  [DocumentTypeCode.CARNET_EXT]: {
    label: "Carnet de Extranjería",
    length: 9,
  },
}

// Types for search client
export type SearchClientParams = {
  document?: string
  documentType?: DocumentTypeCode
}

export enum AccountType {
  CREDIT = "1",
  ANTICIPO = "2",
  NONE = "0",
  CANJE = "20",
  INTERNO = "21",
  SERAFIN = "22",
}

export type PaymentType = {
  id: PaymentTypeEnum
  name: string
  description: string
}
