import { subDays } from "date-fns"
import { Plus, ReplaceAll } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { useGetNotesDocuments } from "@/app/configurations/documents/hooks/useDocumentsService"
import { Button } from "@/components/ui/button"
import { ButtonForm } from "@/shared/components/form/button-form"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { DatePickerForm } from "@/shared/components/form/date-picker-form"
import { InputForm } from "@/shared/components/form/input-form"
import { ComboSearch } from "@/shared/components/ui/combo-search"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"
import { useNote } from "../hooks/useNote"
import { useGetReasons } from "../hooks/useNotesService"
import { type BillingNoteSchema } from "../schemas/note.schema"
import { useProductStore } from "../store/product.store"
import { CreditNoteReasonEnum } from "../types/notes.enum"
import { ModalsNotes } from "./modals/modals-notes"

export function BillingNoteForm() {
  const { addGlobalDiscountProduct, products } = useProductStore()
  const notes = useGetNotesDocuments()
  const reasons = useGetReasons()

  const {
    clients,
    series,
    seriesIsLoading,
    billingDocuments,
    clientId,
    referencedSaleId,
    selectedReason,
    setVoucherSearchTerm,
    setClientSearchTerm,
    handleSelectVoucher,
    handleAcceptForm,
    handleSelectClient,
    handleDeselectClient,
    isLoadingClients,
    isLoadingBillingDocuments,
  } = useNote()

  const form = useFormContext<BillingNoteSchema>()

  return (
    <section className="grid grid-cols-4 gap-4 p-0">
      <ComboBoxForm
        name="documentTypeId"
        label="Tipo de comprobante"
        options={dataToCombo(notes.data, "id", "description")}
        className="w-full!"
      />

      <ComboBoxForm
        name="reason.id"
        label="Tipo de nota"
        options={dataToCombo(reasons.data, "id", "description")}
        className="w-full!"
      />

      <InputForm
        name="description"
        label="Descripción"
        classContainer="col-span-2"
      />

      <ComboSearch
        label="Cliente"
        placeholder="Buscar cliente..."
        options={clients}
        onSearch={setClientSearchTerm}
        onSelect={handleSelectClient}
        onDeselect={handleDeselectClient}
        isLoading={isLoadingClients}
        classContainer="flex-1 col-span-2"
        value={clientId}
      />

      <ComboSearch
        label="Documento referenciado"
        placeholder="Buscar comprobante..."
        options={dataToCombo(billingDocuments.data, "id", "documentNumber")}
        onSearch={setVoucherSearchTerm}
        onSelect={handleSelectVoucher}
        isLoading={isLoadingBillingDocuments}
        value={referencedSaleId}
      />

      <ComboBoxForm
        name="serieId"
        label="Serie"
        options={dataToCombo(series, "id", "seriesNumber")}
        className="w-full!"
        isLoading={seriesIsLoading}
      />

      <DatePickerForm
        name="emissionDate"
        label="Fecha emisión"
        className="w-full!"
        min={subDays(new Date(), 3)}
        max={new Date()}
      />
      {Number(selectedReason) === CreditNoteReasonEnum.DESCUENTO_GLOBAL && (
        <Button
          type="button"
          onClick={() => {
            if (!referencedSaleId) {
              toast.warning(
                "Debe cargar un documento para aplicar el descuento global",
              )
              return
            }
            if (products.length === 0) {
              toast.warning(
                "Debe cargar un documento para aplicar el descuento global",
              )
              return
            }
            addGlobalDiscountProduct()
          }}
          title="Agregar producto de descuento global"
          className="self-end"
        >
          <Plus /> Aplicar descuento global
        </Button>
      )}
      {Number(selectedReason) ===
        CreditNoteReasonEnum.REPROGRAMACION_CUOTAS && (
        <Button
          onClick={async () => {
            // Validate all form fields before opening modal
            const isValid = await form.trigger()
            if (!isValid) {
              toast.error(
                "Debe completar todos los campos requeridos antes de cambiar las cuotas",
              )
              return
            }
            if (!referencedSaleId) {
              toast.warning("Debe cargar un documento para cambiar las cuotas")
              return
            }
            if (products.length === 0) {
              toast.warning("Debe cargar un documento para cambiar las cuotas")
              return
            }

            useModalStore.getState().openModal("modal-installment")
          }}
          type="button"
          className="self-end"
        >
          <ReplaceAll /> Cambiar cuotas
        </Button>
      )}

      <ButtonForm
        type="button"
        className="col-start-4 flex-1 self-end"
        text="Generar"
        onClick={handleAcceptForm}
      />
      <ModalsNotes />
    </section>
  )
}
