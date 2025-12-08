import { z } from "zod"

export const addProductSchema = z.object({
  description: z.string().min(1, "Descripción requerida"),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  foreignName: z.string().min(1, "Nombre extranjero requerido"),
  manageStock: z.boolean(),
  stock: z.coerce.number().min(0, "El stock debe ser mayor o igual a 0"),
  groupProductId: z.coerce.number().min(1, "Debe seleccionar un grupo"),
  measurementUnit: z.string().min(1, "Unidad de medida requerida"),
  localIds: z
    .array(z.string().uuid())
    .min(1, "Debe seleccionar al menos una sede"),
})

export type AddProduct = z.infer<typeof addProductSchema>
