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

type BalanceModalProp =
  | string
  | {
      accountCardId: string
      currentBalance?: number
    }

export default function ModalUpdateBalance() {
  const modalProp = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.UPDATE_BALANCE),
  )?.prop as BalanceModalProp | undefined

  // Si no hay datos, no renderizamos el modal
  if (!modalProp) return null

  const accountCardId =
    typeof modalProp === "string" ? modalProp : modalProp.accountCardId

  const currentBalance =
    typeof modalProp === "string" ? undefined : modalProp.currentBalance

  const editPlate = useEditPlate()

  const form = useForm<PlateBalanceData>({
    resolver: zodResolver(PlateBalanceSchema),
    defaultValues: {
      balance: currentBalance ?? 0,
    },
  })

  const onSubmit = (data: PlateBalanceData) => {
    // Protección extra por si algo viene mal
    if (!accountCardId) return

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
      title="Agregar saldo"
      className="overflow-y-auto sm:w-[400px]"
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <InputForm
          label="Saldo a asignar"
          name="balance"
          type="number"
          step="0.01"
        />

        <Modal.Footer>
          <Button type="submit" variant="outline">
            Guardar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
