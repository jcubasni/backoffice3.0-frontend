import { z } from "zod"
import { clientSchemaOptional, clientSchemaRequired } from "./client.schema"
import {
  creditInvoiceSchemaOptional,
  creditInvoiceSchemaRequired,
} from "./credit-invoice.schema"
import { driverSchemaOptional, driverSchemaRequired } from "./driver.schema"
import { paymentSchema } from "./payment.schema"
import {
  retentionSchemaOptional,
  retentionSchemaRequired,
} from "./retention.schema"
import { vehicleSchemaOptional, vehicleSchemaRequired } from "./vehicle.schema"

export const saleSchema = z.object({
  clientInfo: clientSchemaOptional,
  vehicleInfo: vehicleSchemaOptional,
  driverInfo: driverSchemaOptional,
  retentionInfo: retentionSchemaOptional,
  creditInvoiceInfo: creditInvoiceSchemaOptional,
  accountCardId: z.string().uuid().optional(),
  cardId: z.string().uuid().optional(),
  serieId: z.string({ message: "Serie requerida" }).uuid(),
  currencyId: z.coerce.number().min(1, "Tipo de moneda requerido"),
  notes: z.string().optional(),
  emisionDate: z.date({ message: "Fecha de emisión requerida" }),
  paymentDate: z.date({ message: "Fecha de vencimiento requerida" }),
  payments: z.array(paymentSchema),
})

export type RequiredSchemas = keyof Pick<
  z.infer<typeof saleSchema>,
  | "clientInfo"
  | "vehicleInfo"
  | "driverInfo"
  | "retentionInfo"
  | "creditInvoiceInfo"
  | "accountCardId"
  | "payments"
>

export const requiredSchemas: Record<RequiredSchemas, z.ZodTypeAny> = {
  clientInfo: clientSchemaRequired,
  vehicleInfo: vehicleSchemaRequired,
  driverInfo: driverSchemaRequired,
  retentionInfo: retentionSchemaRequired,
  creditInvoiceInfo: creditInvoiceSchemaRequired,
  payments: z.array(paymentSchema),
  accountCardId: z.string({ message: "Cuenta de cliente requerida" }).uuid(),
} as const

export const getSaleSchema = (requiredFields: RequiredSchemas[]) => {
  let schema = saleSchema

  requiredFields.forEach((field) => {
    if (requiredSchemas[field]) {
      schema = schema.extend({
        [field]: requiredSchemas[field],
      }) as typeof schema
    }
  })

  return schema
}

export type SaleSchema = z.infer<ReturnType<typeof getSaleSchema>>
