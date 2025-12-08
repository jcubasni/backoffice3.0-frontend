import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEditPlate } from "@/app/accounts/hooks/usePlatesServicec"
import {
  PlateBalanceData,
  PlateBalanceSchema,
} from "@/app/accounts/schemas/plate.schema"
import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalAddPlate() {
  const accountCardId = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === Modals.UPDATE_BALANCE,
  )?.prop as string
  const editPlate = useEditPlate()

  const form = useForm<PlateBalanceData>({
    resolver: zodResolver(PlateBalanceSchema),
  })

  const onSubmit = (data: PlateBalanceData) => {
    editPlate.mutate({
      accountCardId,
      body: {
        balance: data.balance,
      },
    })
  }

  return (
    <Modal
      modalId={Modals.UPDATE_BALANCE}
      title="Agregar Saldo"
      className="overflow-y-auto sm:w-100"
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <InputForm label="Balance" name="balance" type="number" step="0.01" />
        <Modal.Footer>
          <Button type="submit" variant="outline">
            Guardar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
