import { z } from "zod"

export const addBankDepositSchema = z.object({
  depositDate: z.date({
    required_error: "La fecha de depósito es obligatoria",
    invalid_type_error: "La fecha de depósito no es válida",
  }),
  bank: z.coerce.number({ message: "El banco es obligatorio" }),
  accountNumber: z.string({ message: "El número de cuenta es obligatorio" }),
  currency: z.enum(["PEN", "USD"], {
    required_error: "La moneda es obligatoria",
    invalid_type_error: "La moneda seleccionada no es válida",
  }),
  depositAmount: z.coerce
    .number({ message: "El monto es obligatorio" })
    .min(1, { message: "El monto depositado debe ser mayor a 0" }),
  observation: z.string().optional(),
})

export type AddBankDeposit = z.infer<typeof addBankDepositSchema>
