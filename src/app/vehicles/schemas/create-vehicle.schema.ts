import { z } from "zod"

export const createVehicleSchema = z.object({
  // Placa en formato ABC-123 o ABC-1234, dejamos la validación “light”
  licensePlate: z
    .string()
    .min(1, "La placa es requerida")
    .max(7, "Máximo 7 caracteres"),

  // ID del tipo de vehículo (viene del ComboBox como string)
  vehicleTypeId: z.string().min(1, "Selecciona un tipo de vehículo"),

  model: z.string().optional().or(z.literal("")),
  tankCapacity: z
    .union([z.coerce.number().nonnegative(), z.nan()])
    .optional()
    .transform((val) => (Number.isNaN(val) ? undefined : val)),

  numberOfWheels: z
    .union([z.coerce.number().int().nonnegative(), z.nan()])
    .optional()
    .transform((val) => (Number.isNaN(val) ? undefined : val)),

  initialKilometrage: z
    .union([z.coerce.number().nonnegative(), z.nan()])
    .optional()
    .transform((val) => (Number.isNaN(val) ? undefined : val)),
})

export type CreateVehicleSchema = z.infer<typeof createVehicleSchema>
