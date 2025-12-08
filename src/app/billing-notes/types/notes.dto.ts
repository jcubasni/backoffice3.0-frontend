import { CreditNoteReasonEnum } from "./notes.enum"
import { InstallmentDTO } from "./notes.type"

// Type base que contiene los campos comunes
type BaseCreditNoteDTO = {
  referencedSaleId: string
  serieId: string
  description: string
}

// Caso 1: Anulación de operación
export type AnnulmentOperationDTO = BaseCreditNoteDTO & {
  reason: {
    id: CreditNoteReasonEnum.ANULACION_OPERACION
  }
}

// Caso 2: Anulación por error en RUC
export type AnnulmentErrorRucDTO = BaseCreditNoteDTO & {
  reason: {
    id: CreditNoteReasonEnum.ANULACION_ERROR_RUC
    correctedRuc: string
  }
}

// Caso 3: Corrección de descripción de items
export type CorrectionDescriptionDTO = BaseCreditNoteDTO & {
  reason: {
    id: CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION
    corrections: Array<{
      saleItemId: string
      correctedDescription: string
    }>
  }
}

// Caso 4: Devolución por item
export type ReturnByItemDTO = BaseCreditNoteDTO & {
  reason: {
    id: CreditNoteReasonEnum.DEVOLUCION_POR_ITEM
    returns: Array<{
      saleItemId: string
      quantity: number
    }>
  }
}

// Caso 5: Descuento por item
export type DiscountByItemDTO = BaseCreditNoteDTO & {
  reason: {
    id: CreditNoteReasonEnum.DESCUENTO_POR_ITEM
    items: Array<{
      saleItemId: string
      quantity: number
      discountAmount: number
    }>
  }
}

// Caso 6: Descuento global
export type DiscountGlobalDTO = BaseCreditNoteDTO & {
  reason: {
    id: CreditNoteReasonEnum.DESCUENTO_GLOBAL
    discountAmount?: number
    discountPercent?: number
    description: string
  }
}

export type RescheduleByInstallmentsDTO = BaseCreditNoteDTO & {
  reason: {
    id: CreditNoteReasonEnum.REPROGRAMACION_CUOTAS
    adjustments: Array<InstallmentDTO>
    comment?: string
  }
}

// Union type para todos los casos de DTO
export type CreateCreditNoteDTO =
  | AnnulmentOperationDTO
  | AnnulmentErrorRucDTO
  | CorrectionDescriptionDTO
  | ReturnByItemDTO
  | DiscountByItemDTO
  | DiscountGlobalDTO
  | RescheduleByInstallmentsDTO
