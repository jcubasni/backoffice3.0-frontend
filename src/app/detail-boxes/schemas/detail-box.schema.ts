import { z } from "zod"
import { DetailBoxesStatus } from "@/app/detail-boxes/types/detail-boxes.type"
import { formatDate } from "@/shared/lib/date"
import { Dates } from "@/shared/lib/date-constans"

export const detailBoxesSearchParams = z.object({
  dailyReportId: z.string().optional(),
  period: z.string().optional(),
  startDate: z.string().optional().default(formatDate(Dates.DetailBoxesStart)),
  endDate: z.string().optional().default(formatDate(Dates.DetailBoxesEnd)),
  statusCode: z.nativeEnum(DetailBoxesStatus).optional(),
})

export type DetailBoxesSearch = z.infer<typeof detailBoxesSearchParams>
