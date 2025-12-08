import { ModalContainer } from "@/shared/components/modals/modal-container"
import { Modals } from "../../lib/product-modals-name"

const modals = [
  {
    modalId: Modals.ADD_PRODUCT,
    component: () => import("./modal-add-products"),
  },
  {
    modalId: Modals.EDIT_PRODUCT,
    component: () => import("./modal-edit-products"),
  },
  {
    modalId: Modals.DELETE_PRODUCT,
    component: () => import("./modal-delete-products"),
  },
]

export const ModalsProduct = () => {
  return <ModalContainer modals={modals} />
}
