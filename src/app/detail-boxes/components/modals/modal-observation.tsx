import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalObservation() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-observation",
  )?.prop
  return (
    <Modal
      modalId="modal-observation"
      className="h-fit rounded-lg sm:w-[400px]"
      title="Observaciones"
    >
      <Input defaultValue={dataModal?.observations} readOnly />
      <Modal.Footer>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-observation")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
