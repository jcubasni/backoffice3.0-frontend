import { z } from "zod"

const optionalString = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))

export const createSupplierSchema = z.object({
  documentType: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "El tipo de documento es inválido",
    }),

  documentNumber: z
    .string()
    .min(5, "El número de documento es muy corto")
    .max(20, "El número de documento es demasiado largo"),

  businessName: z
    .string()
    .min(1, "La razón social es requerida")
    .transform((s) => s.trim()),

  contactName: optionalString,

  email: optionalString.pipe(
    z.string().email("Correo inválido").optional()
  ),

  phone: optionalString,

  address: optionalString,

  isActive: z.boolean().default(true),
})

export type CreateSupplierSchema = z.infer<typeof createSupplierSchema>
