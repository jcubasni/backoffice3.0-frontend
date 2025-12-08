import { StateAudit } from "@/shared/types/state.type"

export type DocumentResponse = {
  id: number
  documentCode: string
  description: string
  name: string
  stateAudit: StateAudit
}

export type AddDocumentDTO = Pick<
  DocumentResponse,
  "documentCode" | "description" | "name"
>

export type UpdateDocumentState = Pick<DocumentResponse, "id" | "stateAudit">
