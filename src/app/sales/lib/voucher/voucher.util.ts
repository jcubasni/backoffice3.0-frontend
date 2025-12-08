import { StateAudit } from "@/shared/types/state.type"
import { SalesProduct } from "../../types/product.type"
import { SaleNotesResponse } from "../../types/voucher.type"

export const fromSaleNotesToProduct = (saleNotes: SaleNotesResponse[]) => {
  // No agrupar productos, mantener cada documento como producto separado
  const salesProducts: SalesProduct[] = saleNotes.map((saleNote) => {
    const calculatedPrice = saleNote.totalAmount / saleNote.quantity
    const calculatedSubtotal = calculatedPrice * saleNote.quantity

    return {
      productId: saleNote.product.id,
      description: saleNote.product.foreignName,
      stateAudit: StateAudit.ACTIVE,
      measurementUnit: undefined,
      price: calculatedPrice.toString(),
      productCode: "",
      stock: "---",
      quantity: saleNote.quantity,
      subtotal: calculatedSubtotal,
      total: saleNote.totalAmount,
      isDocument: true,
      refSaleIds: [saleNote.id],
      refDocumentNumbers: [saleNote.documentNumber],
    }
  })

  return {
    salesProducts,
  }
}
