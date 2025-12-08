import { z } from "zod"

export const addUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  username: z
    .string()
    .min(1, "El nombre de usuario es obligatorio")
    .max(50, "El nombre de usuario no puede superar los 50 caracteres"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede superar los 100 caracteres"),
  cardNumber: z
    .string()
    .min(4, "El número de tarjeta es obligatorio")
    .max(20, "El número de tarjeta no puede superar los 20 caracteres"),
  localIds: z
    .array(z.string({ required_error: "Debe seleccionar al menos una sede" }))
    .min(1, "Debe seleccionar al menos una sede"),
  serieIds: z
    .array(z.string().uuid())
    .optional(),
})

export const editUserSchema = addUserSchema.omit({ password: true })
export type EditUser = z.infer<typeof editUserSchema>
