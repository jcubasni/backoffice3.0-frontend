import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalObservationsBox() {
  const [observations, setObservations] = useState("")
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-observations-box",
  )?.prop
  return (
    <Modal
      modalId="modal-observations-box"
      className="h-fit rounded-lg sm:w-[400px]"
      title="Observaciones"
    >
      <Input
        defaultValue={dataModal?.data}
        onChange={(e) => setObservations(e.target.value)}
      />
      <Modal.Footer className="grid grid-cols-2">
        <Button
          variant="outline"
          onClick={() => {
            dataModal?.changeData(observations)
            useModalStore.getState().closeModal("modal-observations-box")
          }}
        >
          Guardar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            useModalStore.getState().closeModal("modal-observations-box")
          }
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
