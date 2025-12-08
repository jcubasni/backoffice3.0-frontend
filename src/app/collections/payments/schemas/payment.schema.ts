import { format } from "date-fns"
import { z } from "zod"

export const paymentSchema = z.object({
  bank: z.string(),
  amount: z.coerce.number(),
  clientId: z
    .string()
    .optional()
    .transform((value) => (value?.trim() === "" ? undefined : value?.trim())),
  account: z.string(),
  operationNumber: z.string(),
  paymentDate: z.string(),
  currencyId: z.coerce.number(),
})

export type PaymentSchema = z.infer<typeof paymentSchema>

export const paymentsSearchParams = z.object({
  startDate: z.string().date().default(format(new Date(), "yyyy-MM-dd")),
  endDate: z.string().date().optional(),
  client: z.string().optional(),
  search: z.string().optional(),
})
