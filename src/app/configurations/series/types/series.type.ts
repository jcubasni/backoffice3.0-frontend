import z from "zod"
import { Branch } from "../../branches/types/branches.type"
import { DocumentResponse } from "../../documents/types/documents.type"
import { GroupSerieResponse } from "../../group-serie/types/group-serie.type"
import { addSeriesSchema, editSeriesSchema } from "../schemas/series.schema"

type SeriesLocal = Pick<
  Branch,
  "idLocal" | "name" | "localCode" | "telphoneNumber" | "address" | "email"
>

type SeriesDocument = Omit<DocumentResponse, "stateAudit">

type SeriesGroupSerie = Pick<GroupSerieResponse, "idGroupSerie" | "description">

type OriginDocumentType = SeriesDocument

export type SeriesResponse = {
  id: string
  createdAt: string
  seriesNumber: string
  correlativeStart: number
  correlativeCurrent: number
  description: string
  isActive: boolean
  local: SeriesLocal
  document: SeriesDocument
  groupSerie?: SeriesGroupSerie
  originDocumentType: OriginDocumentType
}

export type AddSeriesDTO = z.infer<typeof addSeriesSchema>
export type EditSeriesDTO = z.infer<typeof editSeriesSchema>
