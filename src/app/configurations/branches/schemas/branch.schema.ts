import { z } from "zod"

export const addBranchSchema = z.object({
  localCode: z.string().min(1, "Código requerido"),
  localName: z.string().min(1, "Nombre requerido"),
  address: z.string().optional(),
  telphoneNumber: z.string().superRefine((val, ctx) => {
    if (val && !/^\+?\d{6,15}$/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número inválido",
      })
    }
  }),

  email: z.string().email(),
})

export type AddBranch = z.infer<typeof addBranchSchema>
