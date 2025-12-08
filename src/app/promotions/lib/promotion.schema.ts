// promotions/lib/promotion.schema.ts
import { z } from "zod";

export const promotionItemSchema = z.object({
  productId: z.number(),
  description: z.string(),
});

export const promotionBonusSchema = z.object({
  productId: z.number(),
  description: z.string(),
  quantity: z.number(),
});

export const promotionFormSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  locals: z.array(z.string()).min(1, "Debe seleccionar al menos un local"),
  startDate: z.string(),
  endDate: z.string(),
  note: z.string(),
  amount: z.coerce.number().min(0, "El monto debe ser mayor o igual a 0"),
});

export const promotionSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  locals: z.array(z.string()).min(1, "Debe seleccionar al menos un local"),
  startDate: z.string(),
  endDate: z.string(),
  note: z.string(),
  discountPercent: z.number().min(0, "El monto debe ser mayor o igual a 0"),
  type: z.number(),
  items: z
    .array(promotionItemSchema)
    .min(1, "Debe agregar al menos un producto"),
  bonuses: z
    .array(promotionBonusSchema)
    .min(1, "Debe agregar al menos un regalo"),
});

export type PromotionFormSchema = z.infer<typeof promotionFormSchema>;
export type PromotionSchema = z.infer<typeof promotionSchema>;