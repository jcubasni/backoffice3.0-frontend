import z from "zod"
import { StateAudit } from "@/shared/types/state.type"
import { addDepositTypeSchema } from "../schemas/deposit-type.schema"

export type DepositTypeResponse = {
  codeDepositType: string
  description: string
  movementType: DepositTypeMovementType
  stateAudit: StateAudit
}

export type AddDepositTypeDTO = z.infer<typeof addDepositTypeSchema>
export enum DepositTypeMovementType {
  INPUT = "I",
  OUTPUT = "S",
}

export type DepositTypeState = Pick<
  DepositTypeResponse,
  "codeDepositType" | "stateAudit"
>
