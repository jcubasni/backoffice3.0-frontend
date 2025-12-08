import { ModalLoader } from "@/shared/components/ui/modal-loader"
import ModalAddBranch from "./modal-add-branch"
import ModalDeleteBranch from "./modal-delete-branch"
import ModalEditBranch from "./modal-edit-branch"

export const ModalsBranches = () => {
  return (
    <>
      <ModalLoader modalId="modal-add-branch">
        <ModalAddBranch />
      </ModalLoader>

      <ModalLoader modalId="modal-edit-branch">
        <ModalEditBranch />
      </ModalLoader>

      <ModalLoader modalId="modal-delete-branch">
        <ModalDeleteBranch />
      </ModalLoader>
    </>
  )
}
