import { z } from "zod"

const creditInvoiceSchemaBase = z.object({
  installmentCount: z.coerce
    .number()
    .int("Número de cuotas debe ser un entero"),
  periodStart: z.date({
    message: "Fecha de inicio del período es requerida",
  }),
  periodEnd: z.date({ message: "Fecha de fin del período es requerida" }),
})

export const creditInvoiceSchemaOptional = z.preprocess((data) => {
  return Object.values((data as object) ?? {}).some((value) => !!value)
    ? data
    : undefined
}, creditInvoiceSchemaBase.optional())

export const creditInvoiceSchemaRequired = creditInvoiceSchemaBase

export type CreditInvoiceFormData = z.input<typeof creditInvoiceSchemaBase>
export type CreditInvoice = z.output<typeof creditInvoiceSchemaBase>
