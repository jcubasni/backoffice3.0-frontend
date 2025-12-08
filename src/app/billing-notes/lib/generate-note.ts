import { toast } from "sonner"
import { DECIMAL_PLACES } from "@/shared/lib/constans"
import { BillingNoteSchema } from "../schemas/note.schema"
import { useSaleDocumentStore } from "../store/note.store"
import { useProductStore } from "../store/product.store"
import type { CreateCreditNoteDTO } from "../types/notes.dto"
import { CreditNoteReasonEnum } from "../types/notes.enum"
import { fromDetailsToInstallments } from "./utils"

export const generateCreditNoteDTO = (
  formData: BillingNoteSchema,
): CreateCreditNoteDTO => {
  const baseDTO = {
    referencedSaleId: formData.referencedSaleId,
    serieId: formData.serieId,
    description: formData.description,
  }

  const reasonId = formData.reason.id
  const productChanges = useSaleDocumentStore.getState().productChanges
  const totals = useProductStore.getState().totals

  switch (reasonId) {
    case CreditNoteReasonEnum.ANULACION_OPERACION:
      return {
        ...baseDTO,
        reason: {
          id: CreditNoteReasonEnum.ANULACION_OPERACION,
        },
      }

    case CreditNoteReasonEnum.ANULACION_ERROR_RUC:
      return {
        ...baseDTO,
        reason: {
          id: CreditNoteReasonEnum.ANULACION_ERROR_RUC,
          correctedRuc: formData.description,
        },
      }

    case CreditNoteReasonEnum.DESCUENTO_POR_ITEM:
      if (productChanges.length === 0) {
        throw new Error(
          "Debe modificar al menos un producto para generar una nota de crédito por descuento por ítem",
        )
      }
      return {
        ...baseDTO,
        reason: {
          id: CreditNoteReasonEnum.DESCUENTO_POR_ITEM,
          items: productChanges.map((product) => ({
            saleItemId: product.id,
            quantity: Number(product.quantity.toFixed(DECIMAL_PLACES)),
            discountAmount: Number(product.unitPrice.toFixed(DECIMAL_PLACES)),
          })),
        },
      }

    case CreditNoteReasonEnum.DEVOLUCION_POR_ITEM:
      if (productChanges.length === 0) {
        throw new Error(
          "Debe modificar al menos un producto para generar una nota de crédito por devolución por ítem",
        )
      }
      return {
        ...baseDTO,
        reason: {
          id: CreditNoteReasonEnum.DEVOLUCION_POR_ITEM,
          returns: productChanges.map((product) => ({
            saleItemId: product.id,
            quantity: Number(product.quantity.toFixed(DECIMAL_PLACES)),
          })),
        },
      }

    case CreditNoteReasonEnum.DEVOLUCION_TOTAL:
      return {
        ...baseDTO,
        reason: {
          id: CreditNoteReasonEnum.ANULACION_OPERACION,
        },
      }

    case CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION: {
      const originalProducts = useProductStore.getState().originalProducts
      return {
        ...baseDTO,
        reason: {
          id: CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION,
          corrections: originalProducts.map((product) => ({
            saleItemId: product.id,
            correctedDescription: formData.description,
          })),
        },
      }
    }

    case CreditNoteReasonEnum.DESCUENTO_GLOBAL: {
      const originalProducts = useProductStore.getState().originalProducts
      const products = useProductStore.getState().products
      const originalTotal = originalProducts.reduce(
        (sum, product) => sum + product.total,
        0,
      )
      const discountAmount = originalTotal - totals.total

      return {
        ...baseDTO,
        reason: {
          id: CreditNoteReasonEnum.DESCUENTO_GLOBAL,
          discountAmount: Number(discountAmount.toFixed(DECIMAL_PLACES)),
          description:
            products.find((p) => p.productCode === "9999")?.description ?? "",
        },
      }
    }

    case CreditNoteReasonEnum.REPROGRAMACION_CUOTAS: {
      const installedAmount = useSaleDocumentStore.getState().installmentData

      // Usar las cuotas del store si existen (con fechas editadas del modal)
      // Si no, calcularlas usando la función de utilidad
      const installments =
        installedAmount.installments ??
        fromDetailsToInstallments(
          installedAmount.newInstallmentsCount,
          installedAmount.totalPending,
          installedAmount.startDate,
          installedAmount.endDate,
        )

      if (installments.length === 0) {
        throw new Error(
          "No se pudieron generar las cuotas. Por favor, verifique los datos ingresados.",
        )
      }

      console.log("=== CUOTAS QUE SE ENVIARÁN AL BACKEND ===")
      console.log(
        "Origen:",
        installedAmount.installments
          ? "Modal (editadas)"
          : "Calculadas automáticamente",
      )
      console.log("Número de cuotas:", installments.length)
      console.table(installments)

      return {
        ...baseDTO,
        reason: {
          id: CreditNoteReasonEnum.REPROGRAMACION_CUOTAS,
          adjustments: installments,
        },
      }
    }

    // Add other cases as needed
    default:
      throw toast.error(`Unsupported reason type: ${reasonId}`)
  }
}
