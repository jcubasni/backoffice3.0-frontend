import { z } from "zod"

const optionalString = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))

export const editClientSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: optionalString,
  address: optionalString,

  // ✅ IDS (no nombres)
  departmentId: optionalString, // "15"
  provinceId: optionalString,   // "1501"
  districtId: optionalString,   // "150142"

  email: optionalString.pipe(z.string().email("Email inválido").optional()),
  phone: optionalString,
})

export type EditClientSchema = z.infer<typeof editClientSchema>
