import z from "zod"
import { Branch } from "@/app/configurations/branches/types/branches.type"
import { SeriesResponse } from "@/app/configurations/series/types/series.type"
import { StateAudit } from "@/shared/types/state.type"
import { addUserSchema } from "../schemas/users.schema"

export type Local = Pick<Branch, "idLocal" | "name" | "localName">

export type UserLocal = {
  userLocalId: string
  stateAudit: string
  local: Local
}

type Employee = {
  idEmployee: string
  firstName: string
}
export type UserSerie = {
  idUserSerie: string
  stateAudit: StateAudit
  serie: Serie
}

export type Serie = Pick<SeriesResponse, "id" | "seriesNumber" | "description">

export type User = {
  id: string
  username: string
  cardNumber: string
  UserLocals: UserLocal[]
  userSeries: UserSerie[]
  employee: Employee
}

export type AddUserDTO = z.infer<typeof addUserSchema>
