export type PurchaseStatus = "pending" | "completed" | "cancelled"

export type PurchaseItem = {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type Purchase = {
  id: string
  purchaseNumber: string
  supplierId: string
  supplierName: string
  purchaseDate: string
  items: PurchaseItem[]
  subtotal: number
  tax: number
  total: number
  status: PurchaseStatus
  notes?: string
  createdAt: string
  updatedAt: string
}
