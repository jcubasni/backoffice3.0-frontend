import {
  ModalConfig,
  ModalContainer,
} from "@/shared/components/modals/modal-container"

const modals: ModalConfig[] = [
  {
    modalId: "modal-installment",
    component: () => import("./modal-installment"),
  },
]

export const ModalsNotes = () => {
  return <ModalContainer modals={modals} />
}
