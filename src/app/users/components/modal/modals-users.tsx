import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: "modal-add-user",
    component: () => import("./modal-add-user"),
  },
  {
    modalId: "modal-edit-user",
    component: () => import("./modal-edit-user"),
  },
  {
    modalId: "modal-delete-user",
    component: () => import("./modal-delete-user"),
  },
]

export const ModalsUsers = () => {
  return <ModalContainer modals={modals} />
}
