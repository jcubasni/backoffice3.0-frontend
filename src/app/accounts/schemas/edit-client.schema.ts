// src/app/accounts/schemas/edit-client.schema.ts
import { z } from "zod"

// Helper para strings opcionales que convierte "" a undefined
const optionalString = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))

export const editClientSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: optionalString,
  address: optionalString,
  department: optionalString,
  province: optionalString,
  district: optionalString,
  email: optionalString.pipe(z.string().email("Email inválido").optional()),
  phone: optionalString,
})

export type EditClientSchema = z.infer<typeof editClientSchema>