import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

interface ModalEnableEditProps {
  isEditing: boolean
  onConfirm: () => void
}

export default function ModalEnableEdit() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-enable-edit",
  )?.prop as ModalEnableEditProps

  const isEditing = dataModal?.isEditing || false

  return (
    <Modal
      modalId="modal-enable-edit"
      className="h-fit rounded-lg sm:w-[400px]"
    >
      <p className="px-10 py-0 text-center font-semibold text-lg">
        {isEditing
          ? "Tienes cambios sin guardar. ¿Deseas perder los cambios?"
          : "¿Esta seguro que desea realizar cambios en la liquidación?"}
      </p>
      <Modal.Footer className="grid grid-cols-2">
        <Button
          variant="outline"
          onClick={() => {
            dataModal?.onConfirm()
            useModalStore.getState().closeModal("modal-enable-edit")
          }}
        >
          {isEditing ? "Sí" : "Aceptar"}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-enable-edit")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
