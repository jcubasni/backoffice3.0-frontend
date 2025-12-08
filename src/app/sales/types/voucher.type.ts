export type SaleNotesResponse = {
  id: string
  documentNumber: string
  vehiclePlate: string
  foreignName: string
  totalAmount: number
  createdAt: string
  quantity: number
  product: ProductSaleNoteResponse
}

export type ProductSaleNoteResponse = {
  id: number
  foreignName: string
  unitPrice: number
}

export type VoucherParams = {
  plate?: string
  startDate?: string
  endDate?: string
  maximumAmount?: string
  productId?: string
}
