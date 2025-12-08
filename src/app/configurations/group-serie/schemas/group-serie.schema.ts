import { z } from "zod"

export const addGroupSerieSchema = z.object({
  tipoId: z.coerce
    .number({
      required_error: "El tipo ID es obligatorio",
      invalid_type_error: "El tipo ID debe ser un número válido",
    })
    .positive("El tipo ID debe ser un número positivo"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  localId: z.string().min(1, "El local es obligatorio"),
})

export const editGroupSerieSchema = addGroupSerieSchema.omit({ tipoId: true })

export type AddGroupSerieDTO = z.infer<typeof addGroupSerieSchema>
export type EditGroupSerieDTO = z.infer<typeof editGroupSerieSchema>
