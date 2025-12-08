import { lazy } from "react"
import { ModalLoader } from "@/shared/components/ui/modal-loader"

const ModalAddSeries = lazy(() => import("./modal-add-series"))
const ModalEditSeries = lazy(() => import("./modal-edit-series"))
const ModalDeleteSeries = lazy(() => import("./modal-delete-series"))

export const ModalsSeries = () => {
  return (
    <>
      <ModalLoader modalId="modal-add-series">
        <ModalAddSeries />
      </ModalLoader>
      <ModalLoader modalId="modal-edit-series">
        <ModalEditSeries />
      </ModalLoader>
      <ModalLoader modalId="modal-delete-series">
        <ModalDeleteSeries />
      </ModalLoader>
    </>
  )
}
