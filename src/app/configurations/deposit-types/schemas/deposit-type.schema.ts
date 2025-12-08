import { z } from "zod"
import { DepositTypeMovementType } from "../types/deposit-types.type"

export const addDepositTypeSchema = z.object({
  codeDepositType: z
    .string()
    .min(1, "El código es obligatorio")
    .max(10, "Máximo 10 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  movementType: z.nativeEnum(DepositTypeMovementType, {
    required_error: "El tipo de movimiento es obligatorio",
    invalid_type_error: "Debe ser 'S' (Salida) o 'I' (Ingreso)",
  }),
})
