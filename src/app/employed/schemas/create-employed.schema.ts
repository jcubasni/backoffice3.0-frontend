import { z } from "zod"
import {
  DocumentTypeCode,
  DocumentTypeInfo,
} from "@/app/common/types/common.type"

// Helper: strings opcionales que convierten "" → undefined
const optionalString = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))

// Schema principal para crear empleado
export const createEmployedSchema = z
  .object({
    documentType: z.nativeEnum(DocumentTypeCode, {
      errorMap: () => ({ message: "Tipo de documento inválido" }),
    }),

    documentNumber: z.string().min(1, "El número de documento es requerido"),

    firstName: z.string().min(1, "El nombre es requerido"),

    lastName: optionalString,

    address: optionalString,

    department: optionalString,

    province: optionalString,

    district: optionalString,

    email: optionalString.pipe(
      z.string().email("Email inválido").optional()
    ),

    phoneNumber: optionalString,
  })

  // Validación: longitud del documento según tipo
  .refine(
    (data) => {
      const docInfo = DocumentTypeInfo[data.documentType]
      return data.documentNumber.length === docInfo.length
    },
    (data) => {
      const docInfo = DocumentTypeInfo[data.documentType]
      return {
        message: `El ${docInfo.label} debe tener ${docInfo.length} dígitos`,
        path: ["documentNumber"],
      }
    },
  )

export type CreateEmployedSchema = z.infer<typeof createEmployedSchema>
