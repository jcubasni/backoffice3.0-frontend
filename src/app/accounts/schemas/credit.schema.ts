import { z } from "zod"

export const creditSchema = z.object({
  creditLine: z.coerce.number().min(1, "Línea de crédito es requerida"),
  balance: z.coerce.number().min(1, "Saldo es requerido"),
  startDate: z.date({
    required_error: "Fecha de inicio es requerida",
  }),
  endDate: z.date({ required_error: "Fecha de fin es requerida" }),
  billingDays: z.coerce.number().min(1, "Días de Facturación es requerido"),
  creditDays: z.coerce.number().min(1, "Días de Créditos es requerido"),
  installments: z.coerce.number().min(1, "Cuotas es requerido"),
  // file: z.instanceof(File).optional(),
})

export const creditSchemaOptional = z.preprocess((data) => {
  return Object.values((data as object) ?? {}).some((value) => !!value)
    ? data
    : undefined
}, creditSchema.optional())

export const creditSchemaRequired = creditSchema
