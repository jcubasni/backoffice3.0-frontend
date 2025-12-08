import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: "modal-preview-sale",
    component: () => import("./modal-preview-sale"),
  },
]

export const ModalsSale = () => {
  return <ModalContainer modals={modals} />
}
