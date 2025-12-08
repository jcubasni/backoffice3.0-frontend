import { z } from "zod"

export const addBankAccountSchema = z.object({
  accountNumber: z
    .string()
    .min(14, "El número de cuenta bancaria debe tener al menos 14 caracteres")
    .max(20, "El número de cuenta bancaria no debe exceder los 20 caracteres"),
  bankId: z.coerce.number({
    required_error: "El banco es obligatorio",
    invalid_type_error: "Debe seleccionar un banco válido",
  }),
  currencyId: z.string().min(1, "La moneda es obligatoria"),
  description: z.string().min(1, "La descripción es obligatoria"),
})

export type AddBankAccount = z.infer<typeof addBankAccountSchema>
