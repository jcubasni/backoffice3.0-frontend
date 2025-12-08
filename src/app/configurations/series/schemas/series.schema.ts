import { z } from "zod"

export const addSeriesSchema = z.object({
  idDocument: z.coerce.number({ message: "El documento es requerido" }),
  seriesNumber: z
    .string()
    .min(4, "El número de serie debe tener al menos 4 caracteres")
    .max(4, "El número de serie debe tener como máximo 4 caracteres")
    .refine((val) => /^[A-Z][0-9]{3}$/.test(val), {
      message:
        "El número de serie debe empezar con una letra seguida de 3 números",
    }),
  correlativeStart: z.coerce
    .number({ message: "El correlativo actual es obligatorio" })
    .min(0, "El correlativo actual debe ser mayor o igual a 1"),
  description: z.string().min(1, "Descripción requerida"),
  idLocal: z.string({ message: "El local es requierido" }),
  groupSerieId: z.string().optional(),
  originDocumentTypeId: z.coerce.number().optional(),
}).refine((data) => {
  if (data.idDocument === 4 || data.idDocument === 5) {
    return data.originDocumentTypeId !== undefined && data.originDocumentTypeId !== null
  }
  return true
}, {
  message: "El tipo de documento es requerido para notas de crédito y débito",
  path: ["originDocumentTypeId"]
})

export const editSeriesSchema = addSeriesSchema
