import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useEditDepositType } from "../../hooks/useDepositTypesService"
import { DepositTypeResponse } from "../../types/deposit-types.type"

export default function ModalEditDepositType() {
  const {
    description: desc,
    movementType: movement,
    codeDepositType: code,
  } = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-edit-deposit-type",
  )?.prop as DepositTypeResponse

  const [codeDepositType, setCodeDepositType] = useState(code ?? "")
  const [description, setDescription] = useState(desc ?? "")
  const [movementType, setMovementType] = useState(movement ?? "S")

  const editDepositType = useEditDepositType()

  const handleEdit = () => {
    editDepositType.mutate({
      id: code,
      body: {
        codeDepositType,
        description,
        movementType,
      },
    })
  }

  return (
    <Modal
      modalId="modal-edit-deposit-type"
      title="Editar tipo de depósito"
      className="overflow-y-auto sm:w-[400px]"
      scrollable={true}
    >
      <Input
        label="Código:"
        value={codeDepositType}
        onChange={(e) => setCodeDepositType(e.target.value)}
      />
      <Input
        label="Descripción:"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <ComboBox
        label="Tipo de movimiento:"
        value={movementType}
        onChange={(value) => setMovementType(value)}
        options={[
          { label: "Salida", value: "S" },
          { label: "Ingreso", value: "I" },
        ]}
      />
      <Modal.Footer>
        <Button variant="outline" onClick={handleEdit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
