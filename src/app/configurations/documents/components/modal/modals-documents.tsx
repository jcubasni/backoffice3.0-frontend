import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: "modal-add-document",
    component: () => import("./modal-add-document"),
  },
  {
    modalId: "modal-edit-document",
    component: () => import("./modal-edit-document"),
  },
  {
    modalId: "modal-delete-document",
    component: () => import("./modal-delete-document"),
  },
]

export const ModalsDocuments = () => {
  return <ModalContainer modals={modals} />
}
