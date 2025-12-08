import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: "modal-payment",
    component: () => import("./modal-payment"),
  },
  {
    modalId: "modal-add-client",
    component: () => import("./modal-add-client"),
  },
  {
    modalId: "modal-installment",
    component: () => import("./modal-installment")
  }
]

export const SaleModals = () => {
  return <ModalContainer modals={modals} />
}
