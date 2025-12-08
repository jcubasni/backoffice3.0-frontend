"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

const assignBalanceSchema = z.object({
  balance: z.coerce.number().min(0, "El saldo no puede ser negativo"),
})

type AssignBalanceSchema = z.infer<typeof assignBalanceSchema>

export default function ModalAssignBalance() {
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.UPDATE_BALANCE),
  )?.prop as {
    currentBalance?: number
    onAssignBalance: (balance: number) => void
  }

  const { closeModal } = useModalStore()

  const form = useForm<AssignBalanceSchema>({
    resolver: zodResolver(assignBalanceSchema),
    defaultValues: {
      balance: dataModal?.currentBalance || 0,
    },
  })

  const handleSubmit = (data: AssignBalanceSchema) => {
    if (dataModal?.onAssignBalance) {
      dataModal.onAssignBalance(data.balance)
    }
    closeModal(Modals.UPDATE_BALANCE)
    form.reset()
  }

  const handleClose = () => {
    closeModal(Modals.UPDATE_BALANCE)
    form.reset()
  }

  return (
    <Modal
      modalId={Modals.UPDATE_BALANCE}
      title="Asignar Saldo"
      className="md:max-w-md!"
      onClose={handleClose}
    >
      <FormWrapper form={form} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p className="text-slate-600 text-sm">
            Ingrese el saldo inicial para esta cuenta
          </p>
          <InputForm
            label="Saldo (S/)"
            name="balance"
            type="number"
            placeholder="0.00"
            step="0.01"
            autoFocus
          />
        </div>

        <Modal.Footer className="grid-cols-2">
          <Button type="button" onClick={handleClose} variant="outline">
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
