import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useAddDepositType } from "../../hooks/useDepositTypesService"
import { addDepositTypeSchema } from "../../schemas/deposit-type.schema"
import {
  AddDepositTypeDTO,
  DepositTypeMovementType,
} from "../../types/deposit-types.type"

export default function ModalAddDepositType() {
  const { closeModal } = useModalStore()
  const addDepositType = useAddDepositType()

  const form = useForm<AddDepositTypeDTO>({
    resolver: zodResolver(addDepositTypeSchema),
    defaultValues: {
      movementType: DepositTypeMovementType.OUTPUT,
    },
  })

  const handleSave = (data: AddDepositTypeDTO) => {
    addDepositType.mutate(data)
  }

  return (
    <Modal
      modalId="modal-add-deposit-type"
      title="Agregar tipo de depósito"
      className="sm:w-[400px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <InputForm
          label="Código"
          name="codeDepositType"
          placeholder="Ej. 0001"
        />
        <InputForm
          label="Descripción"
          name="description"
          placeholder="Ej. Cierre de caja"
        />
        <ComboBoxForm
          label="Tipo de movimiento"
          name="movement_type"
          options={[
            { label: "Salida", value: "S" },
            { label: "Ingreso", value: "I" },
          ]}
        />

        <Modal.Footer className="grid-cols-2">
          <Button>Guardar</Button>
          <Button
            type="button"
            onClick={() => closeModal("modal-add-deposit-type")}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
