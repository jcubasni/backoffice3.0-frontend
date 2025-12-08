import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ButtonForm } from "@/shared/components/form/button-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import useBranchStore from "@/shared/store/branch.store"
import { useModalStore } from "@/shared/store/modal.store"
import { useAddSide } from "../../hooks/useSidesService"
import { AddSideDTO, addSideSchema } from "../../schemas/side.schema"

export default function ModalAddSide() {
  const { closeModal } = useModalStore()
  const addSide = useAddSide()
  const localId = useBranchStore.getState().selectedBranch?.localId

  const form = useForm<AddSideDTO>({
    mode: "onChange",
    resolver: zodResolver(addSideSchema),
  })

  const handleSave = (values: AddSideDTO) => {
    addSide.mutateAsync({
      ...values,
      localId: localId ?? "",
    })
  }

  return (
    <Modal
      modalId="modal-add-side"
      title="Agregar Lado"
      className="sm:w-[450px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <InputForm
          label="Nombre del lado:"
          name="name"
          placeholder="Ej: Lado 1"
        />
        <Modal.Footer className="grid-cols-2">
          <ButtonForm text="Guardar" isPending={addSide.isPending} />
          <Button type="button" onClick={() => closeModal("modal-add-side")}>
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
