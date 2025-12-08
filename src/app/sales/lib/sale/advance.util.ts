import { StateAudit } from "@/shared/types/state.type"
import { SalesProduct } from "../../types/product.type"
import { idAdvanceProduct } from "../../types/sale"
import { DocumentResponse } from "../../types/sale/sale.type"

export const fromDocumentToSalesProducts = (
  document: DocumentResponse,
): { products: SalesProduct[]; documentId: string } => {
  return {
    products: [
      {
        productId: idAdvanceProduct,
        description: document.id,
        price: "0",
        productCode: "09999",
        stock: "0",
        stateAudit: StateAudit.ACTIVE,
        measurementUnit: "UND",
        quantity: 0,
        subtotal: 0,
        total: document.advanceBalance,
        isDocument: true,
      },
    ],
    documentId: document.documentNumber,
  }
}
