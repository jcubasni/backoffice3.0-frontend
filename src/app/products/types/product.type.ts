import { StateAudit } from "@/shared/types/state.type"

export type ProductByGroupProduct = {
  productId: number
  description: string
  price: string
  stateAudit: string
  groupProduct?: string
}

type documentOperationType = {
  id: number
  description: string
}

export type DetractionType = {
  id: number
  description: string
  percentage: string
  documentOperationType: documentOperationType
}

type GroupProduct = {
  id: number
  description?: string
}

export type ProductResponse = {
  productId: number
  description: string
  stateAudit: StateAudit
  measurementUnit?: string
  price: string
  productCode?: string
  stock: string
  detractionType?: DetractionType
  groupProduct?: GroupProduct
}
