import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ButtonForm } from "@/shared/components/form/button-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useAddDocument } from "../../hooks/useDocumentsService"
import {
  AddDocumentDTO,
  addDocumentSchema,
} from "../../schemas/document.schema"

export default function ModalAddDocument() {
  const addDocument = useAddDocument()

  const form = useForm<AddDocumentDTO>({
    mode: "onChange",
    resolver: zodResolver(addDocumentSchema),
  })

  const handleSave = (data: AddDocumentDTO) => {
    addDocument.mutate(data)
  }

  return (
    <Modal
      modalId="modal-add-document"
      title="Agregar tipo de documento"
      className="sm:w-[400px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <InputForm label="Código SUNAT" name="code" placeholder="Ej. 01" />
        <InputForm
          label="Descripción"
          name="description"
          placeholder="Ej. FACTURA ELECTRÓNICA"
          onChange={(e) =>
            form.setValue("description", e.target.value.toUpperCase(), {
              shouldValidate: true,
            })
          }
        />
        <InputForm
          label="Abreviatura:"
          name="shortName"
          placeholder="Ej: FAC"
          onChange={(e) =>
            form.setValue("shortName", e.target.value.toUpperCase(), {
              shouldValidate: true,
            })
          }
        />
        <Modal.Footer>
          <ButtonForm text="Guardar" isPending={addDocument.isPending} />
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
