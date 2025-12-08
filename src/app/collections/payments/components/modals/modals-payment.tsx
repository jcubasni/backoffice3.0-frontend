import {
  ModalConfig,
  ModalContainer,
} from "@/shared/components/modals/modal-container"

const modals: ModalConfig[] = [
  {
    modalId: "modal-new-payment",
    component: () => import("./modal-new-payment"),
  },
  {
    modalId: "modal-receivable",
    component: () => import("./modal-receivable"),
  },
]

export const ModalsPayment = () => {
  return <ModalContainer modals={modals} />
}
