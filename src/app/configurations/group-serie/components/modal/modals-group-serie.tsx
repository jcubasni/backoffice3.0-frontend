import { lazy } from "react"
import { ModalLoader } from "@/shared/components/ui/modal-loader"

const ModalAddGroupSerie = lazy(() => import("./modal-add-group-serie"))
const ModalEditGroupSerie = lazy(() => import("./modal-edit-group-serie"))
const ModalDeleteGroupSerie = lazy(() => import("./modal-delete-group-serie"))

export const ModalsGroupSerie = () => {
  return (
    <>
      <ModalLoader modalId="modal-add-group-serie">
        <ModalAddGroupSerie />
      </ModalLoader>
      <ModalLoader modalId="modal-edit-group-serie">
        <ModalEditGroupSerie />
      </ModalLoader>
      <ModalLoader modalId="modal-delete-group-serie">
        <ModalDeleteGroupSerie />
      </ModalLoader>
    </>
  )
}