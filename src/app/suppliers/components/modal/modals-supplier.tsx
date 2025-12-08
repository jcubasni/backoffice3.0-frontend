import { Modals } from "@/app/suppliers/types/modals-name"
import { ModalContainer } from "@/shared/components/modals/modal-container"

const modals = [
  {
    modalId: Modals.ADD_SUPPLIER,
    component: () =>
      import("./modal-supplier/modal-add-supplier"),
  },
]

export const ModalsSupplier = () => {
  return <ModalContainer modals={modals} />
}
