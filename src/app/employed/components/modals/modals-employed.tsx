import { Modals } from "@/app/employed/types/modals-name"
import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: Modals.ADD_EMPLOYED,
    component: () => import("./modal-employed/modal-add-employed"),
  },
]

export const ModalsEmployeds = () => {
  return <ModalContainer modals={modals} />
}
