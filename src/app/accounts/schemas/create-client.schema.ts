import { z } from "zod"
import {
  DocumentTypeCode,
  DocumentTypeInfo,
} from "@/app/common/types/common.type"
import { AccountTypeForClient } from "../types/client.type"

// Helper para strings opcionales que convierte "" a undefined
const optionalString = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))

const numberCoerce = z.coerce.number().int()
const optionalNumber = numberCoerce
  .optional()
  .transform((val) => (val === 0 ? undefined : val))

/**
 * ✅ documentType "amigable":
 * - Tu ComboBox suele mandar "" cuando no hay selección.
 * - Zod nativeEnum no acepta "".
 * - Entonces: preprocesamos "" -> undefined y mostramos mensaje humano.
 */
const documentTypeSchema = z
  .union([z.literal(""), z.nativeEnum(DocumentTypeCode)])
  .transform((val) => (val === "" ? undefined : val))
  .refine((val) => val !== undefined, {
    message: "Selecciona un tipo de documento",
  })



// Schema para la data de cuenta de crédito
const accountDataSchema = z
  .object({
    creditLine: numberCoerce.positive("La línea de crédito debe ser mayor a 0"),
    balance: numberCoerce.min(0, "El saldo no puede ser negativo"),
    billingDays: numberCoerce.positive(
      "Los días de facturación deben ser mayores a 0",
    ),
    creditDays: numberCoerce.positive(
      "Los días de crédito deben ser mayores a 0",
    ),
    installments: numberCoerce.positive("Las cuotas deben ser mayores a 0"),
    startDate: z.date({
      required_error: "La fecha de inicio es requerida",
      invalid_type_error: "La fecha de inicio debe ser una fecha válida",
    }),
    endDate: z.date({
      required_error: "La fecha de fin es requerida",
      invalid_type_error: "La fecha de fin debe ser una fecha válida",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  })

// Schema para una cuenta
const accountSchema = z
  .object({
    accountTypeId: z.nativeEnum(AccountTypeForClient, {
      errorMap: () => ({ message: "Tipo de cuenta inválido" }),
    }),
    accountData: z.optional(accountDataSchema),
  })
  .refine(
    (data) => {
      if (data.accountTypeId === AccountTypeForClient.CREDIT) {
        return data.accountData !== undefined
      }
      return true
    },
    {
      message:
        "La información de crédito es requerida para cuentas de tipo CREDIT",
      path: ["accountData"],
    },
  )

// Schema para la asignación de cuenta a vehículo
const vehicleAccountTypeSchema = z.object({
  accountTypeId: z.nativeEnum(AccountTypeForClient, {
    errorMap: () => ({ message: "Tipo de cuenta inválido" }),
  }),
  cardNumber: z.string().min(1, "El número de tarjeta es requerido"),
  balance: numberCoerce.min(0, "El saldo no puede ser negativo").optional(),
  productIds: z.array(numberCoerce).optional(),
})

// Schema para un vehículo
export const vehicleSchema = z.object({
  licensePlate: z.string().min(1, "La placa es requerida"),
  vehicleType: z.string().min(1, "El tipo de vehículo es requerido"),
  cardNumber: z.string().min(1, "El número de tarjeta es requerido"),
  model: optionalString,
  tankCapacity: optionalNumber,
  numberOfWheels: optionalNumber,
  initialKilometrage: optionalNumber,
  accountsType: z
    .array(vehicleAccountTypeSchema)
    .optional()
    .transform((val) => (val?.length === 0 ? undefined : val)),
})

// Schema principal para crear cliente
export const createClientSchema = z
  .object({
    documentType: documentTypeSchema,
    documentNumber: z
      .string()
      .min(1, "El número de documento es requerido")
      .regex(/^\d+$/, "El número de documento debe contener solo dígitos"),
    firstName: z.string().min(1, "El nombre es requerido"),
    lastName: optionalString,
    address: optionalString,
    departmentId: optionalString,
    provinceId: optionalString,
    districtId: optionalString,
    email: optionalString.pipe(z.string().email("Email inválido").optional()),
    phone: optionalString,
    accounts: z
      .array(accountSchema)
      .optional()
      .transform((val) => (val?.length === 0 ? undefined : val)),
    vehicles: z
      .array(vehicleSchema)
      .optional()
      .transform((val) => (val?.length === 0 ? undefined : val)),
  })
  .superRefine((data, ctx) => {
    // ✅ Si no hay tipo de documento, no validamos longitud
    if (!data.documentType) return
    if (!data.documentNumber) return

    const docTypeInfo = DocumentTypeInfo[data.documentType]
    if (!docTypeInfo) return

    if (data.documentNumber.length !== docTypeInfo.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El ${docTypeInfo.label} debe tener ${docTypeInfo.length} dígitos`,
        path: ["documentNumber"],
      })
    }
  })

export type CreateClientSchema = z.infer<typeof createClientSchema>
export type AccountSchema = z.infer<typeof accountSchema>
export type VehicleSchema = z.infer<typeof vehicleSchema>
export type AccountDataSchema = z.infer<typeof accountDataSchema>
export type VehicleAccountTypeSchema = z.infer<typeof vehicleAccountTypeSchema>
