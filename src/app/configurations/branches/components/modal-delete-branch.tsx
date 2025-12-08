import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteBranch } from "../hooks/useBranchesService"

export default function ModalDeleteBranch() {
  const id = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === "modal-delete-branch"),
  )?.prop

  const deleteBranch = useDeleteBranch()

  const handleDelete = () => {
    if (!id) return
    deleteBranch.mutate(id, {
      onSuccess: () => {
        useModalStore.getState().closeModal("modal-delete-branch")
      },
      onError: () => {
        // Puedes mostrar toast aquí si lo deseas
      },
    })
  }

  return (
    <Modal
      modalId="modal-delete-branch"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-0 text-center font-semibold text-lg">
        ¿Está seguro que desea eliminar esta sede?
      </p>

      <Modal.Footer className="grid grid-cols-2">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-branch")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
