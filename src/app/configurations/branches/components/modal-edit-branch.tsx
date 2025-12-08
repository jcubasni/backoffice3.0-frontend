import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ButtonForm } from "@/shared/components/form/button-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useEditBranch } from "../hooks/useBranchesService"
import { AddBranch, addBranchSchema } from "../schemas/branch.schema"
import { Branch } from "../types/branches.type"

export default function ModalEditBranch() {
  const { idLocal, localCode, localName, email, address, telphoneNumber } =
    useModalStore((state) =>
      state.openModals.find((modal) => modal.id === "modal-edit-branch"),
    )?.prop as Branch

  const editBranch = useEditBranch()

  const form = useForm<AddBranch>({
    mode: "onChange",
    resolver: zodResolver(addBranchSchema),
  })

  const handleSave = (data: AddBranch) => {
    editBranch.mutate({ id: idLocal, body: data })
  }

  return (
    <Modal
      modalId="modal-edit-branch"
      title="Editar Sede"
      className="sm:w-[400px]"
      scrollable={true}
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <InputForm
          label="Código Local:"
          name="localCode"
          defaultValue={localCode ?? ""}
        />
        <InputForm
          label="Nombre:"
          name="localName"
          defaultValue={localName ?? ""}
        />
        <InputForm label="Correo:" name="email" defaultValue={email ?? ""} />
        <InputForm
          label="Dirección:"
          name="address"
          defaultValue={address ?? ""}
        />
        <InputForm
          label="Teléfono:"
          name="telphoneNumber"
          inputMode="tel"
          defaultValue={telphoneNumber ?? ""}
        />
        <Modal.Footer>
          <ButtonForm text="Guardar" isPending={editBranch.isPending} />
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
