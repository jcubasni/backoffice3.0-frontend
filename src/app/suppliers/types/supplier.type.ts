export type SupplierResponse = {
  id: string
  documentType: {
    id: number
    name: string
  }
  documentNumber: string
  businessName: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
}
