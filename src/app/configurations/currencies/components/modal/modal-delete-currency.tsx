import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useDeleteCurrency } from "../../hooks/useCurrenciesService"

export default function ModalDeleteCurrency() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-delete-currency",
  )?.prop as string

  const deleteCurrency = useDeleteCurrency()

  const handleDelete = () => {
    deleteCurrency.mutate(dataModal)
  }

  return (
    <Modal
      modalId="modal-delete-currency"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-0 text-center font-semibold text-lg">
        ¿Está seguro que desea eliminar esta moneda?
      </p>
      <Modal.Footer className="grid grid-cols-2">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-currency")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
