import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useEditCurrency } from "../../hooks/useCurrenciesService"

export default function ModalEditCurrency() {
  const dataModal = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === "modal-edit-currency",
  )?.prop

  const [currencyCode, setCurrencyCode] = useState(
    dataModal?.currencyCode ?? "",
  )
  const [currencyType, setCurrencyType] = useState(
    dataModal?.currencyType ?? "",
  )
  const [simpleDescription, setSimpleDescription] = useState(
    dataModal?.simpleDescription ?? "",
  )
  const [completeDescription, setCompleteDescription] = useState(
    dataModal?.completeDescription ?? "",
  )

  const editCurrency = useEditCurrency()

  const handleEdit = () => {
    editCurrency.mutate({
      id: dataModal?.idCurrency ?? "",
      body: {
        currencyCode,
        currencyType,
        simpleDescription,
        completeDescription,
      },
    })
  }

  return (
    <Modal
      modalId="modal-edit-currency"
      title="Editar moneda"
      className="overflow-y-auto sm:w-[400px]"
      scrollable={true}
    >
      <Input
        label="Código Moneda:"
        value={currencyCode}
        onChange={(e) => setCurrencyCode(e.target.value)}
      />
      <Input
        label="Tipo:"
        value={currencyType}
        onChange={(e) => setCurrencyType(e.target.value)}
      />
      <Input
        label="Descripción corta:"
        value={simpleDescription}
        onChange={(e) => setSimpleDescription(e.target.value)}
      />
      <Input
        label="Descripción completa:"
        value={completeDescription}
        onChange={(e) => setCompleteDescription(e.target.value)}
      />

      <Button variant="outline" onClick={handleEdit}>
        Guardar
      </Button>
    </Modal>
  )
}
