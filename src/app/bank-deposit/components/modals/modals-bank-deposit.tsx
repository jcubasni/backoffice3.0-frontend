import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: "modal-add-bank-deposit",
    component: () => import("./modal-add-bank-deposit"),
  },
  {
    modalId: "modal-edit-bank-deposit",
    component: () => import("./modal-edit-bank-deposit"),
  },
  {
    modalId: "modal-delete-bank-deposit",
    component: () => import("./modal-delete-bank-deposit"),
  },
]

export const ModalsBankDeposit = () => {
  return <ModalContainer modals={modals} />
}
