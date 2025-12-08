import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ButtonForm } from "@/shared/components/form/button-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useEditDocument } from "../../hooks/useDocumentsService"
import { EditDocument, editDocumentSchema } from "../../schemas/document.schema"
import { DocumentResponse } from "../../types/documents.type"

export default function ModalEditDocument() {
  const {
    id: idDocument,
    documentCode: code,
    description,
    name: shortName,
  } = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-edit-document",
  )?.prop as DocumentResponse

  const editDocument = useEditDocument()
  const form = useForm<EditDocument>({
    mode: "onChange",
    resolver: zodResolver(editDocumentSchema),
  })

  const handleEdit = (data: EditDocument) => {
    editDocument.mutate({
      id: idDocument,
      body: data,
    })
  }

  return (
    <Modal
      modalId="modal-edit-document"
      title="Editar documento"
      className="overflow-y-auto sm:w-[400px]"
      scrollable={true}
    >
      <FormWrapper form={form} onSubmit={handleEdit}>
        <InputForm label="Código Documento:" name="code" defaultValue={code} />
        <InputForm
          label="Descripción:"
          name="description"
          defaultValue={description}
        />
        <InputForm
          label="Abreviatura:"
          name="shortName"
          defaultValue={shortName}
        />
        <Modal.Footer>
          <ButtonForm text="Guardar" isPending={editDocument.isPending} />
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
