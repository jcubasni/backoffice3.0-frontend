import { lazy } from "react"
import { ModalLoader } from "@/shared/components/ui/modal-loader"

const ModalAddCurrency = lazy(() => import("./modal-add-currency"))
const ModalEditCurrency = lazy(() => import("./modal-edit-currency"))
const ModalDeleteCurrency = lazy(() => import("./modal-delete-currency"))

export const ModalsCurrencies = () => {
  return (
    <>
      <ModalLoader modalId="modal-add-currency">
        <ModalAddCurrency />
      </ModalLoader>

      <ModalLoader modalId="modal-edit-currency">
        <ModalEditCurrency />
      </ModalLoader>

      <ModalLoader modalId="modal-delete-currency">
        <ModalDeleteCurrency />
      </ModalLoader>
    </>
  )
}
