import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteDepositType } from "../../hooks/useDepositTypesService"

export default function ModalDeleteDepositType() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-delete-deposit-type",
  )?.prop as string

  const deleteDepositType = useDeleteDepositType()

  const handleDelete = () => {
    deleteDepositType.mutate(dataModal)
  }

  return (
    <Modal
      modalId="modal-delete-deposit-type"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-0 text-center font-semibold text-lg">
        ¿Está seguro que desea eliminar este tipo de depósito?
      </p>
      <Modal.Footer className="grid grid-cols-2">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-deposit-type")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
