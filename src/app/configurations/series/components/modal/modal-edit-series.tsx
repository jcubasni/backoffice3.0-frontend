import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { useGetBranches } from "@/app/configurations/branches/hooks/useBranchesService"
import {
  useGetDocuments,
  useGetDocumentsForBillingNotes,
} from "@/app/configurations/documents/hooks/useDocumentsService"
import { useGetAvailableGroupSeries } from "@/app/configurations/group-serie/hooks/useGroupSerieService"
import { Button } from "@/components/ui/button"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"
import { useEditSeries } from "../../hooks/useSeriesService"
import { editSeriesSchema } from "../../schemas/series.schema"
import { EditSeriesDTO, SeriesResponse } from "../../types/series.type"

export default function ModalEditSeries() {
  const {
    id,
    document,
    correlativeCurrent,
    correlativeStart,
    seriesNumber,
    local,
    description,
    groupSerie,
  } = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === "modal-edit-series"),
  )?.prop as SeriesResponse

  const { closeModal } = useModalStore()
  const editSeries = useEditSeries()
  const documentsQuery = useGetDocuments()
  const branches = useGetBranches()

  const form = useForm<EditSeriesDTO>({
    resolver: zodResolver(editSeriesSchema),
    defaultValues: {
      seriesNumber,
      correlativeStart: correlativeCurrent,
      description,
      idLocal: local.idLocal,
      groupSerieId: groupSerie?.idGroupSerie,
    },
  })

  const localId = useWatch({
    control: form.control,
    name: "idLocal",
    defaultValue: local.idLocal,
  })

  const documentId = useWatch({
    control: form.control,
    name: "idDocument",
    defaultValue: document.id,
  })

  const billingNotes = documentId == 4 || documentId == 5
  const documentsForBillingNotes = useGetDocumentsForBillingNotes(billingNotes)
  const groupSeries = useGetAvailableGroupSeries(documentId, localId)

  const handleSave = async (body: EditSeriesDTO) => {
    editSeries.mutate({ id, body })
  }

  return (
    <Modal
      modalId="modal-edit-series"
      title="Editar Serie"
      className="sm:w-[500px]"
      scrollable={true}
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <ComboBoxForm
          label="Tipo Documento"
          name="idDocument"
          options={dataToCombo(documentsQuery.data, "id", "description")}
          className="w-full!"
          defaultValue={document.id}
        />
        <InputForm
          tabIndex={-1}
          label="N° Serie"
          name="seriesNumber"
          onChange={(e) => {
            form.setValue("seriesNumber", e.target.value.toUpperCase(), {
              shouldValidate: true,
            })
          }}
        />
        <InputForm
          label="Correlativo Actual"
          name="correlativeStart"
          type="number"
          disabled={correlativeStart !== correlativeCurrent}
        />
        <InputForm label="Descripción" name="description" />
        <ComboBoxForm
          label="Local"
          name="idLocal"
          options={dataToCombo(branches.data, "idLocal", "localName")}
          className="w-full!"
        />
        <ComboBoxForm
          label="Grupo"
          name="groupSerieId"
          options={dataToCombo(groupSeries.data, "idGroupSerie", "description")}
          className="w-full!"
          disabled={groupSeries.isLoading || !groupSeries.data?.length}
          isLoading={groupSeries.isLoading}
          placeholder={
            groupSeries.isSuccess && !groupSeries.data?.length
              ? "No hay grupos en este local"
              : undefined
          }
        />
        {billingNotes && (
          <ComboBoxForm
            label="Tipo de documento"
            name="originDocumentTypeId"
            options={dataToCombo(
              documentsForBillingNotes.data,
              "id",
              "description",
            )}
          />
        )}
        <Modal.Footer className="grid-cols-2">
          <Button variant="outline">Guardar</Button>
          <Button type="button" onClick={() => closeModal("modal-edit-series")}>
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
