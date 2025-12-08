import { z } from "zod"
import { CreditNoteReasonEnum } from "../types/notes.enum"

export const billingNoteSchema = z.object({
  documentTypeId: z.coerce.number({
    message: "El tipo de comprobante es requerido",
  }),
  reason: z.object({
    id: z.coerce
      .number({
        required_error: "El tipo de nota es requerido",
        invalid_type_error: "El tipo de nota debe ser un número",
      })
      .pipe(
        z.nativeEnum(CreditNoteReasonEnum, {
          errorMap: () => ({
            message: "El tipo de nota seleccionado no es válido",
          }),
        }),
      ),
  }),
  description: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "La descripción debe ser un texto",
    })
    .min(1, "La descripción es requerida"),
  clientId: z.string().uuid("El cliente es requerido"),
  referencedSaleId: z.string().uuid("El documento referenciado es requerido"),
  serieId: z
    .string({
      required_error: "La serie es requerida",
      invalid_type_error: "La serie debe ser un texto",
    })
    .uuid("La serie seleccionada no es válida"),
  emissionDate: z.date({
    required_error: "La fecha de emisión es requerida",
    invalid_type_error: "La fecha de emisión no es válida",
  }),
})

export const updateBillingNoteSchema = billingNoteSchema.partial().extend({
  id: z.string(),
})

export type BillingNoteSchema = z.infer<typeof billingNoteSchema>
export type UpdateBillingNoteSchema = z.infer<typeof updateBillingNoteSchema>
