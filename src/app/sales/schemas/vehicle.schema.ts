import { z } from "zod"

const vehicleSchemaBase = z.object(
  {
    plate: z
      .string({ message: "La placa es requerida" })
      .min(7, { message: "La placa debe tener 6 caracteres" }),
    mileage: z.coerce.number().optional(),
  },
  { message: "La placa es requerida" },
)

export const vehicleSchemaOptional = z.preprocess((data) => {
  return Object.values((data as object) ?? {}).some((value) => !!value)
    ? data
    : undefined
}, vehicleSchemaBase.optional())

export const vehicleSchemaRequired = vehicleSchemaBase
