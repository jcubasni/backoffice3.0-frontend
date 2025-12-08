import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteSide } from "../../hooks/useSidesService"

export default function ModalDeleteSide() {
  const { closeModal, openModals } = useModalStore()
  const sideId = openModals.find((m) => m.id === "modal-delete-side")
    ?.prop as string

  const deleteSide = useDeleteSide()

  const handleDelete = () => {
    deleteSide.mutate(sideId)
  }

  return (
    <Modal
      modalId="modal-delete-side"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-4 text-center font-semibold text-lg">
        ¿Está seguro que desea eliminar este lado?
      </p>
      <Modal.Footer className="grid grid-cols-2 gap-2">
        <Button onClick={() => closeModal("modal-delete-side")}>
          Cancelar
        </Button>
        <Button onClick={handleDelete}>Eliminar</Button>
      </Modal.Footer>
    </Modal>
  )
}
