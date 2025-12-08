import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import useBranchStore from "@/shared/store/branch.store"
import { useModalStore } from "@/shared/store/modal.store"
import {
  useAddGroupSerie,
  useGetGroupSerieTypes,
} from "../../hooks/useGroupSerieService"
import {
  AddGroupSerieDTO,
  addGroupSerieSchema,
} from "../../schemas/group-serie.schema"

export default function ModalAddGroupSerie() {
  const { data: groupSerieTypes, isLoading } = useGetGroupSerieTypes()
  const branches = useBranchStore((state) => state.branch)
  const addGroupSerie = useAddGroupSerie()

  const form = useForm<AddGroupSerieDTO>({
    resolver: zodResolver(addGroupSerieSchema),
  })

  const handleSave = (data: AddGroupSerieDTO) => {
    addGroupSerie.mutate(data)
  }

  return (
    <Modal
      modalId="modal-add-group-serie"
      title="Agregar Grupo Serie"
      className="sm:w-[450px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <ComboBoxForm
          options={dataToCombo(groupSerieTypes, "id", "name")}
          label="Tipo ID:"
          name="tipoId"
          className="w-full!"
          isLoading={isLoading}
        />
        <InputForm label="Descripción:" name="description" />
        <ComboBoxForm
          options={dataToCombo(branches, "localId", "localName")}
          name="localId"
          label="Local"
          className="w-full!"
        />
        <Modal.Footer className="grid-cols-2">
          <Button variant="outline">Guardar</Button>
          <Button
            type="button"
            onClick={() =>
              useModalStore.getState().closeModal("modal-add-group-serie")
            }
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
