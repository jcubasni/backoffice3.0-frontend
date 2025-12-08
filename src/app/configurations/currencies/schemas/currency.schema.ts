import { z } from "zod"

export const addCurrencySchema = z.object({
  currencyCode: z
    .string()
    .min(1, "El código de moneda es obligatorio")
    .max(4, "Máximo 4 caracteres"),
  currencyType: z
    .string()
    .min(1, "El tipo de moneda es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  simpleDescription: z
    .string()
    .min(1, "La descripción corta es obligatoria")
    .max(50, "Máximo 50 caracteres"),
  completeDescription: z
    .string()
    .min(1, "La descripción completa es obligatoria")
    .max(100, "Máximo 100 caracteres"),
})

export type AddCurrencyDTO = z.infer<typeof addCurrencySchema>
export type AddCurrency = z.infer<typeof addCurrencySchema>
