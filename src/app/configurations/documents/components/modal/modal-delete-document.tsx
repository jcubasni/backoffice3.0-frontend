import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteDocument } from "../../hooks/useDocumentsService"

export default function ModalDeleteDocument() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-delete-document",
  )?.prop as string

  const deleteDocument = useDeleteDocument()

  const handleDelete = () => {
    deleteDocument.mutate(dataModal)
  }

  return (
    <Modal
      modalId="modal-delete-document"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-0 text-center font-semibold text-lg">
        ¿Está seguro que desea eliminar este documento?
      </p>
      <Modal.Footer className="grid grid-cols-2">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-document")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
