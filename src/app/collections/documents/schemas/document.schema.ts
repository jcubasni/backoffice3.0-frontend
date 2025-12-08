import { format } from "date-fns"
import z from "zod"
import { paymentSchema as paymentSchemaBase } from "../../payments/schemas/payment.schema"

export const documentsSearchParams = z.object({
  startDate: z.string().date().default(format(new Date(), "yyyy-MM-dd")),
  endDate: z.string().date().default(format(new Date(), "yyyy-MM-dd")),
  client: z.string().uuid().optional(),
  search: z.string().optional(),
})

export const paymentSchema = paymentSchemaBase.omit({
  clientId: true,
})

export type PaymentSchema = z.infer<typeof paymentSchema>