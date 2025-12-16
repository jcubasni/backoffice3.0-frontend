import { Modals } from "@/app/accounts/types/modals-name"
import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: Modals.ADD_PLATE,
    component: () => import("./modal-add-plate"),
  },
  {
    modalId: Modals.UPDATE_BALANCE,
    component: () => import("./modal-update-balance"),
  },
  {
  modalId: Modals.UPDATE_CARD_PRODUCTS,
  component: () => import("./modal-update-card-products"),
},

]

export const ModalsPlate = () => {
  return <ModalContainer modals={modals} />
}
