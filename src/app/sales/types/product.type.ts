import {
  DetractionType,
  ProductResponse,
} from "@/app/products/types/product.type"

export enum GroupProductType {
  COMBUSTIBLE = 5,
}

export type SalesProduct = ProductResponse & {
  quantity: number
  subtotal?: number
  total?: number
  isDocument?: boolean
  detractionType?: DetractionType
  detractionAmount?: number
  refSaleIds?: string[]
  refDocumentNumbers?: string[]
}

export interface Totals {
  subtotal: number
  igv: number
  total: number
  freeTransfer: number
  detraction: number
  retentionAmount: number
  totalToPay: number
}
