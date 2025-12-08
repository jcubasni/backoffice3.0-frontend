import { z } from "zod"

const retentionSchemaBase = z.object({
  retentionTypeId: z.coerce.number(),
})

export const retentionSchemaOptional = z.preprocess((data) => {
  return Object.values((data as object) ?? {}).some((value) => !!value)
    ? data
    : undefined
}, retentionSchemaBase.optional())

export const retentionSchemaRequired = retentionSchemaBase

export type RetentionFormData = z.infer<typeof retentionSchemaBase>
