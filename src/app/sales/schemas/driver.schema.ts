import { z } from "zod"

const driverSchemaBase = z.object({
  documentTypeId: z.coerce
    .number({
      message: "Debe seleccionar un tipo de documento",
    })
    .positive(),
  documentNumber: z.string().min(8, {
    message: "Debe ingresar un número de documento válido",
  }),
  firstName: z
    .string({
      message: "Debe de ingresar un nombre",
    })
    .min(3),
  lastName: z
    .string()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .nullish(),
  address: z
    .string()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .nullish(),
})

export const driverSchemaOptional = z.preprocess((data) => {
  return Object.values((data as object) ?? {}).some((value) => !!value)
    ? data
    : undefined
}, driverSchemaBase.optional())

export const driverSchemaRequired = driverSchemaBase
