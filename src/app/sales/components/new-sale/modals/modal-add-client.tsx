import { Button } from "@/components/ui/button"
import Modal from "@/shared/components/ui/modal"

export default function ModalAddClient() {
  return (
    <Modal
      modalId="modal-add-client"
      title="Agregar cliente"
      className="sm:w-[400px]"
      scrollable={true}
    >
      <Modal.Footer>
        <Button variant="outline">Guardar</Button>
      </Modal.Footer>
    </Modal>
  )
}
