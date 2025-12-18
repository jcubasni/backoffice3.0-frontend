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

  // ✅ obligatorio, pero con default 0
  balance: z.coerce.number().min(0, "El saldo no puede ser negativo").default(0),

  productId: z.coerce.number().min(1, "El producto es requerido"),
})

export const plateArraySchema = z.object({
  plates: z.array(plateItemSchema).min(1, "Debe agregar al menos una placa"),
})

export type PlateArrayData = z.infer<typeof plateArraySchema>
