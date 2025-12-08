import { toast } from "sonner"
import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalDeleteClients() {
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.DELETE_CLIENT),
  )?.prop

  const handleDelete = () => {
    toast.success("Cliente eliminado correctamente")
    useModalStore.getState().closeModal(Modals.DELETE_CLIENT)
  }

  return (
    <Modal
      modalId={Modals.DELETE_CLIENT}
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="mx-auto font-medium text-gray-600">
        ID Cliente: <span className="font-bold">{dataModal}</span>
      </p>
      <p className="px-10 py-4 text-center font-semibold text-lg">
        ¿Estás seguro que deseas eliminar este cliente?
      </p>
      <Modal.Footer className="grid grid-cols-2 gap-2 px-6 pb-6">
        <Button variant="outline" onClick={handleDelete}>
          Eliminar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal(Modals.DELETE_CLIENT)
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
