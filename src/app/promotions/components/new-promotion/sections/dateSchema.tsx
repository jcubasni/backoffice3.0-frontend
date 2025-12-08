import { z } from "zod";

export const datesSchema = z
  .object({
    inicioPromotion: z.date({
      required_error: "La fecha de inicio es obligatoria",
    }),
    finPromotion: z.date({
      required_error: "La fecha de fin es obligatoria",
    }),
  })
  // Validar inicio >= hoy
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data.inicioPromotion >= today;
    },
    {
      message: "La fecha de inicio no puede ser menor a la fecha actual",
      path: ["inicioPromotion"],
    }
  )
  // Validar fin >= inicio
  .refine(
    (data) => data.finPromotion >= data.inicioPromotion,
    {
      message: "La fecha de fin no puede ser menor a la fecha de inicio",
      path: ["finPromotion"],
    }
  );

// 👇 Tipo inferido automáticamente sin errores
export type DatesSchemaType = z.infer<typeof datesSchema>;
