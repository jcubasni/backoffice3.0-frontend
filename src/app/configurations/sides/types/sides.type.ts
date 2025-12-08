import { ProductResponse } from "@/app/products/types/product.type"
import { StateAudit } from "@/shared/types/state.type"

export type AddSideDTO = {
  name: string
  localId: string
}

export type Side = {
  id: string
  name: string
  hoses?: Hose[]
}

type Hose = {
  id: string
  hoseName: string
  product?: ProductResponse
  stateAudit: StateAudit
}
