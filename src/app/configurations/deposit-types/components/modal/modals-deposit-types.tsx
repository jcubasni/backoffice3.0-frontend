import { lazy } from "react"
import { ModalLoader } from "@/shared/components/ui/modal-loader"

const ModalAddDepositType = lazy(() => import("./modal-add-deposit-type"))
const ModalEditDepositType = lazy(() => import("./modal-edit-deposit-type"))
const ModalDeleteDepositType = lazy(() => import("./modal-delete-deposit-type"))

export const ModalsDepositTypes = () => {
  return (
    <>
      <ModalLoader modalId="modal-add-deposit-type">
        <ModalAddDepositType />
      </ModalLoader>

      <ModalLoader modalId="modal-edit-deposit-type">
        <ModalEditDepositType />
      </ModalLoader>

      <ModalLoader modalId="modal-delete-deposit-type">
        <ModalDeleteDepositType />
      </ModalLoader>
    </>
  )
}
