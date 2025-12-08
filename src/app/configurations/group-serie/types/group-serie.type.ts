import { GeneralType } from "@/shared/types/general-type"
import { Branch } from "../../branches/types/branches.type"

type GroupSerieLocal = Pick<Branch, "idLocal" | "localName">

export type GroupSerieTipo = Pick<GeneralType, "id" | "name">

export type GroupSerieResponse = {
  idGroupSerie: string
  description: string
  isUsed: boolean
  stateAudit: string
  tipo: GroupSerieTipo
  local: GroupSerieLocal
}

export type GroupSerieType = GeneralType
