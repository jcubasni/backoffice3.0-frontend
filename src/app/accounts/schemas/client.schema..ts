import { z } from "zod"
import { AccountType, DocumentTypeCode } from "@/app/common/types/common.type"
import { creditSchemaOptional, creditSchemaRequired } from "./credit.schema"

const clientInfoSchema = z.object({
  documentType: z.nativeEnum(DocumentTypeCode, {
    errorMap: () => ({ message: "Tipo de documento es requerido" }),
  }),
  documentNumber: z.string().min(1, "RUC / DNI es requerido"),
  firstName: z.string().min(1, "Razón social / Nombres es requerido"),
  lastName: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((val) => val ?? undefined),
  address: z
    .string()
    .optional()
    .or(z.literal(""))
    .or(z.null())
    .transform((val) => val ?? undefined),
  accountType: z.nativeEnum(AccountType, {
    errorMap: () => ({ message: "El tipo de cuenta es requerido" }),
  }),
})

const clientSchema = z.object({
  client: clientInfoSchema,
  credit: creditSchemaOptional,
})

export type RequiredSchemas = keyof Pick<z.infer<typeof clientSchema>, "credit">

export const requiredSchemas: Record<RequiredSchemas, z.ZodTypeAny> = {
  credit: creditSchemaRequired,
} as const

export const getClientSchema = (requiredFields: RequiredSchemas[]) => {
  let schema = clientSchema

  requiredFields.forEach((field) => {
    if (requiredSchemas[field]) {
      schema = schema.extend({
        [field]: requiredSchemas[field],
      }) as typeof schema
    }
  })

  return schema
}

export type ClientSchema = z.infer<ReturnType<typeof getClientSchema>>

// Tipo para el formulario que incluye tanto opcional como requerido
export type ClientFormSchema = {
  client: {
    documentType: DocumentTypeCode
    documentNumber: string
    firstName: string
    accountType: AccountType
    lastName?: string | undefined
    address?: string | undefined
  }
  credit?:
    | {
        creditLine: number
        balance: number
        startDate: Date
        endDate: Date
        billingDays: number
        creditDays: number
        installments: number
      }
    | undefined
}
