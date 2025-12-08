import {
  ModalConfig,
  ModalContainer,
} from "@/shared/components/modals/modal-container"

const modals: ModalConfig[] = [
  {
    modalId: "modal-installment",
    component: () => import("./modal-installment"),
  },
  {
    modalId: "modal-payment",
    component: () => import("./modal-payment"),
  },
]

export const ModalsDocuments = () => {
  return <ModalContainer modals={modals} />
}
