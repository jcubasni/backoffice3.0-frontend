import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: "modal-add-side",
    component: () => import("./modal-add-side"),
  },
  {
    modalId: "modal-delete-side",
    component: () => import("./modal-delete-side"),
  },
]

export const ModalsSides = () => {
  return <ModalContainer modals={modals} />
}
