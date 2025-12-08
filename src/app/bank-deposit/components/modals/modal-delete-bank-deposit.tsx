import { useDeleteDeposit } from "@bank-deposit/hooks/useBankDepositService"
import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalDeleteBankDeposit() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-delete-bank-deposit",
  )?.prop
  const deleteBankDeposit = useDeleteDeposit()

  const handleDelete = () => {
    if (!dataModal) return
    deleteBankDeposit.mutate(dataModal)
  }

  return (
    <Modal
      modalId="modal-delete-bank-deposit"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-0 text-center font-semibold text-lg">
        ¿Esta seguro que desea eliminar el registro de depósito seleccionado?
      </p>
      <Modal.Footer className="grid grid-cols-2">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-bank-deposit")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
