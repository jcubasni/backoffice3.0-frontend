import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { ComboBox } from "@/shared/components/ui/combo-box"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import useBranchStore from "@/shared/store/branch.store"
import { useModalStore } from "@/shared/store/modal.store"
import {
  useGetGroupSerieTypes,
  useUpdateGroupSerie,
} from "../../hooks/useGroupSerieService"
import {
  type EditGroupSerieDTO,
  editGroupSerieSchema,
} from "../../schemas/group-serie.schema"
import { GroupSerieResponse } from "../../types/group-serie.type"

export default function ModalEditGroupSerie() {
  const { idGroupSerie, tipo, description, local } = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === "modal-edit-group-serie"),
  )?.prop as GroupSerieResponse

  const { data: groupSerieTypes, isLoading } = useGetGroupSerieTypes()
  const branches = useBranchStore((state) => state.branch)
  const { closeModal } = useModalStore()
  const editGroupSerie = useUpdateGroupSerie()

  const form = useForm<EditGroupSerieDTO>({
    resolver: zodResolver(editGroupSerieSchema),
    defaultValues: {
      description: description || "",
    },
  })

  const handleSave = async (body: EditGroupSerieDTO) => {
    editGroupSerie.mutate({ id: idGroupSerie, data: body })
  }

  return (
    <Modal
      modalId="modal-edit-group-serie"
      title="Editar Grupo Serie"
      className="sm:w-[450px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <ComboBox
          options={dataToCombo(groupSerieTypes, "id", "name")}
          value={tipo?.id?.toString()}
          label="Tipo:"
          isLoading={isLoading}
          disabled
          defaultValue={tipo?.id?.toString()}
          className="w-full!"
        />
        <InputForm label="Descripción:" name="description" />
        <ComboBoxForm
          options={dataToCombo(branches, "localId", "localName")}
          name="localId"
          label="Local"
          className="w-full!"
          disabled
          defaultValue={local.idLocal}
        />
        <Modal.Footer className="grid-cols-2">
          <Button variant="outline">Guardar</Button>
          <Button
            type="button"
            onClick={() => closeModal("modal-edit-group-serie")}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
