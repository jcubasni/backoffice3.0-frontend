import { z } from "zod"

export const plateItemSchema = z.object({
  plate: z
    .string()
    .min(1, "La placa es requerida")
    .transform((val) => val.toUpperCase())
    .refine(
      (val) => /^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(val),
      "La placa debe tener el formato XXX-XXX (3 caracteres, guión, 3 caracteres)",
    ),
  cardNumber: z.string().min(1, "El número de tarjeta es requerido"),
  productId: z.coerce.number().min(1, "El producto es requerido"),
})

export const plateArraySchema = z.object({
  plates: z.array(plateItemSchema).min(1, "Debe agregar al menos una placa"),
})

export type PlateArrayData = z.infer<typeof plateArraySchema>

export const PlateBalanceSchema = z.object({
  balance: z.coerce.number().min(1, "El balance es requerido"),
})

export type PlateBalanceData = z.infer<typeof PlateBalanceSchema>
