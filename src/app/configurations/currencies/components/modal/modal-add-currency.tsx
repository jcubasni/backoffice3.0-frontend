import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ButtonForm } from "@/shared/components/form/button-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { useAddCurrency } from "../../hooks/useCurrenciesService"
import {
  AddCurrencyDTO,
  addCurrencySchema,
} from "../../schemas/currency.schema"

export default function ModalAddCurrency() {
  const { closeModal } = useModalStore()
  const addCurrency = useAddCurrency()

  const form = useForm<AddCurrencyDTO>({
    resolver: zodResolver(addCurrencySchema),
  })

  const handleSave = (data: AddCurrencyDTO) => {
    addCurrency.mutate(data)
  }

  return (
    <Modal
      modalId="modal-add-currency"
      title="Agregar moneda"
      className="sm:w-[400px]"
    >
      <FormWrapper form={form} onSubmit={handleSave}>
        <InputForm label="Código moneda" name="currencyCode" />
        <InputForm label="Tipo" name="currencyType" />
        <InputForm label="Descripción corta" name="simpleDescription" />
        <InputForm label="Descripción completa" name="completeDescription" />
        <Modal.Footer className="grid-cols-2">
          <ButtonForm text="Guardar" isPending={addCurrency.isPending} />
          <Button
            type="button"
            onClick={() => closeModal("modal-add-currency")}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
