import { z } from "zod"

const clientSchemaBase = z.object(
  {
    id: z.string({ message: "El cliente es obligatorio" }),
    documentTypeId: z.coerce.number({
      message: "El cliente es obligatorio",
    }),
    documentNumber: z.string({ message: "El cliente es obligatorio" }),
    firstName: z.string({
      message: "El cliente es obligatorio",
    }),
    lastName: z
      .string()
      .transform((val) => (val?.trim() === "" ? null : val))
      .nullable(),
    address: z
      .string()
      .transform((val) => (val?.trim() === "" ? null : val))
      .nullish(),
    isCredit: z.boolean({ message: "El cliente es obligatorio" }),
  },
  { message: "El cliente es obligatorio" },
)

export const clientSchemaOptional = z.preprocess((data) => {
  return Object.values((data as object) ?? {}).some((value) => !!value)
    ? data
    : undefined
}, clientSchemaBase.optional())

export const clientSchemaRequired = clientSchemaBase
