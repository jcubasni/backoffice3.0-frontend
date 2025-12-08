import { z } from "zod"

export const addSideSchema = z.object({
  name: z.string().min(1, "El nombre del lado es requerido"),
})

export type AddSideDTO = z.infer<typeof addSideSchema>
