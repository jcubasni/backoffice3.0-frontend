import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalDeleteCompanies() {
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === "modal-delete-companies"),
  )?.prop

  const handleDelete = () => {
    toast.success("Empresa eliminada correctamente")
    useModalStore.getState().closeModal("modal-delete-companies")
  }

  return (
    <Modal
      modalId="modal-delete-companies"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="mx-auto font-medium text-gray-600">
        ID Empresa: <span className="font-bold">{dataModal}</span>
      </p>
      <p className="px-10 py-4 text-center font-semibold text-lg">
        ¿Estás seguro que deseas eliminar esta empresa?
      </p>
      <Modal.Footer className="grid grid-cols-2 gap-2 px-6 pb-6">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-delete-companies")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
