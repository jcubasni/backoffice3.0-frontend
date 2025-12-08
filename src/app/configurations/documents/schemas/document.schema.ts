import { z } from "zod"

export const addDocumentSchema = z.object({
  code: z.enum(["01", "03", "07", "08", "20", "40", "09", "14"], {
    errorMap: () => ({ message: "El código no es un codigo valido por SUNAT" }),
  }),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "Máximo 50 caracteres"),
  shortName: z
    .string()
    .min(1, "La abreviatura es obligatoria")
    .max(1, "La abreviatura es de solo un carater"),
})

export type AddDocumentDTO = z.infer<typeof addDocumentSchema>
export type AddDocument = z.infer<typeof addDocumentSchema>

export const editDocumentSchema = addDocumentSchema
export type EditDocument = z.infer<typeof editDocumentSchema>
