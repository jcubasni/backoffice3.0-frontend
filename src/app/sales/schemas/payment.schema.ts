import { z } from "zod"
import { CodeComponentE } from "../types/payment"

const Base_schema = z.object({
  paymentMethodId: z.string().regex(/^000\d+$/, {
    message: "Debe de seleccionar un método de pago",
  }),
  amountToCollect: z.coerce.number().positive({
    message: "Debe ingresar un monto a cobrar",
  }),
})
export const CP001_schema = Base_schema.extend({
  componentId: z.literal(CodeComponentE.CASH),
  currencyId: z.coerce.number().min(1),
  received: z.coerce.number().positive({
    message: "Debe ingresar un monto recibido",
  }),
})

export const CP002_schema = Base_schema.extend({
  componentId: z.literal(CodeComponentE.CARD),
  referenceDocument: z.string().min(1, {
    message: "Debe ingresar un número de referencia",
  }),
  cardTypeCode: z.string({
    required_error: "Debe ingresar un tipo de tarjeta",
  }),
})

const Empty_schema = Base_schema.extend({
  componentId: z.literal(CodeComponentE.EMPTY),
})

export const paymentSchema = z.discriminatedUnion("componentId", [
  CP001_schema,
  CP002_schema,
  Empty_schema,
])

export type CP001_schema = z.infer<typeof CP001_schema>
export type CP002_schema = z.infer<typeof CP002_schema>
export type PaymentSchema = z.infer<typeof paymentSchema>
