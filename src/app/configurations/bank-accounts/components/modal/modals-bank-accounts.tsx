import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: "modal-add-bank-account",
    component: () => import("./modal-add-bank-account"),
  },
  {
    modalId: "modal-edit-bank-account",
    component: () => import("./modal-edit-bank-account"),
  },
  {
    modalId: "modal-delete-bank-account",
    component: () => import("./modal-delete-bank-account"),
  },
]

export const ModalsBankAccounts = () => {
  return <ModalContainer modals={modals} />
}
