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
import { useAddSeries } from "../../hooks/useSeriesService"
import { addSeriesSchema } from "../../schemas/series.schema"
import { AddSeriesDTO } from "../../types/series.type"

export default function ModalAddSeries() {
  const addSeries = useAddSeries()
  const documents = useGetDocuments()
  const branches = useGetBranches()

  const form = useForm<AddSeriesDTO>({
    resolver: zodResolver(addSeriesSchema),
  })

  const documentId = useWatch({
    control: form.control,
    name: "idDocument",
  })

  const localId = useWatch({
    control: form.control,
    name: "idLocal",
  })

  const billingNotes = documentId == 4 || documentId == 5
  const documentsForBillingNotes = useGetDocumentsForBillingNotes(billingNotes)
  const groupSeries = useGetAvailableGroupSeries(documentId, localId)

  const handleSave = (data: AddSeriesDTO) => {
    addSeries.mutate(data)
  }

  return (
    <Modal
      modalId="modal-add-series"
      title="Agregar Serie"
      className="sm:w-[450px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <ComboBoxForm
          label="Tipo Documento:"
          name="idDocument"
          options={dataToCombo(documents.data, "id", "description")}
          className="w-full!"
        />
        <InputForm
          label="N° Serie:"
          name="seriesNumber"
          onChange={(e) => {
            form.setValue("seriesNumber", e.target.value.toUpperCase(), {
              shouldValidate: true,
            })
          }}
        />
        <InputForm
          label="Correlativo Actual:"
          name="correlativeStart"
          type="number"
        />
        <InputForm label="Descripción:" name="description" />
        <ComboBoxForm
          label="Local"
          name="idLocal"
          options={dataToCombo(branches.data, "idLocal", "localName")}
          className="w-full!"
          isLoading={branches.isLoading}
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
          <Button
            type="button"
            onClick={() =>
              useModalStore.getState().closeModal("modal-add-series")
            }
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
