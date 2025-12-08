import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ButtonForm } from "@/shared/components/form/button-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useAddBranch } from "../hooks/useBranchesService"
import { AddBranch, addBranchSchema } from "../schemas/branch.schema"
import { AddBranchDTO } from "../types/branches.type"

export default function ModalAddBranch() {
  const addBranch = useAddBranch()

  const form = useForm<AddBranch>({
    mode: "onChange",
    resolver: zodResolver(addBranchSchema),
  })

  const handleSave = (data: AddBranch) => {
    const dto: AddBranchDTO = {
      ...data,
      address: data.address ?? "",
    }
    addBranch.mutate(dto)
  }

  return (
    <Modal
      modalId="modal-add-branch"
      title="Agregar sede"
      className="sm:w-[400px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <InputForm label="Nombre de referencia" name="localCode" />
        <InputForm label="Nombre de la sede" name="localName" />
        <InputForm label="Correo electrónico" name="email" type="text" />
        <InputForm label="Dirección" name="address" />
        <InputForm label="Teléfono" name="telphoneNumber" inputMode="tel" />
        <Modal.Footer>
          <ButtonForm text="Guardar" isPending={addBranch.isPending} />
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
