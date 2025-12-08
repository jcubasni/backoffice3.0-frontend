import { z } from "zod"

export const voucherSearchParams = z.object({
  productId: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  plate: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  startDate: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine(
      (val) => val === undefined || !Number.isNaN(Date.parse(val)),
      "Invalid date",
    ),
  endDate: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine(
      (val) => val === undefined || !Number.isNaN(Date.parse(val)),
      "Invalid date",
    ),
  maximumAmount: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
})
