import { z } from "zod"
import { DECIMAL_PLACES } from "@/shared/lib/constans"

const taxDetailSchema = z.object({
  type: z.literal("IGV"),
  amount: z.number(),
})

const saleDetailSchema = z
  .object({
    taxDetail: taxDetailSchema,
    productId: z.number().positive("El ID del producto debe ser positivo"),
    quantity: z.number().positive("La cantidad debe ser positiva"),
    // unitPrice: z.number().positive("Unit price must be positive"),
    unitPrice: z.number(),
    taxAmount: z.number().min(0, "El impuesto debe ser no negativo"),
    grandTotal: z.number(),
  })
  .refine(
    (data) => {
      const { quantity, unitPrice, taxAmount, grandTotal } = data
      const expectedGrandTotal = Number(
        (unitPrice * quantity + taxAmount).toFixed(DECIMAL_PLACES),
      )

      return (
        Number(
          Math.abs(grandTotal - expectedGrandTotal).toFixed(DECIMAL_PLACES),
        ) <= 0.01
      )
    },
    {
      message:
        "El cálculo del total general es incorrecto. Debe ser (cantidad * precio unitario) + monto del impuesto",
      path: ["grandTotal"],
    },
  )

export const saleDetailsSchema = z
  .array(saleDetailSchema)
  .min(1, { message: "Nesecitas al menos una producto seleccionado" })

export type SaleDetail = z.infer<typeof saleDetailSchema>
export type SaleDetails = z.infer<typeof saleDetailsSchema>
