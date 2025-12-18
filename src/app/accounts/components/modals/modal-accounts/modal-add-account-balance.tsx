"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { formatCurrency } from "@/shared/lib/number"

const addBalanceSchema = z.object({
  amount: z.coerce.number().min(0, "El monto no puede ser negativo"),
  note: z.string().optional(),
})

type AddBalanceSchema = z.infer<typeof addBalanceSchema>

export default function ModalAddAccountBalance() {
  const dataModal = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.ADD_ACCOUNT_BALANCE),
  )?.prop as
    | {
        currentBalance?: number
        onAssignBalance: (amount: number, note?: string) => void
      }
    | undefined

  const { closeModal } = useModalStore()

  const current = dataModal?.currentBalance ?? 0

  const form = useForm<AddBalanceSchema>({
    resolver: zodResolver(addBalanceSchema),
    defaultValues: {
      amount: 0,
      note: "",
    },
  })

  // ✅ Si abres el modal varias veces, resetea el form cada vez
  useEffect(() => {
    form.reset({ amount: 0, note: "" })
  }, [dataModal?.currentBalance]) // suficiente para "detectar" reapertura

  const amount = form.watch("amount") ?? 0

  const nextBalance = useMemo(() => {
    const a = Number.isFinite(amount) ? Number(amount) : 0
    return current + a
  }, [current, amount])

  const handleSubmit = (data: AddBalanceSchema) => {
  const cleanedNote = (data.note ?? "").trim()

  dataModal?.onAssignBalance(
    data.amount,
    cleanedNote.length > 0 ? cleanedNote : "Ajuste de saldo",
  )

  closeModal(Modals.ADD_ACCOUNT_BALANCE)
  form.reset({ amount: 0, note: "" })
}


  const handleClose = () => {
    closeModal(Modals.ADD_ACCOUNT_BALANCE)
    form.reset({ amount: 0, note: "" })
  }

  return (
    <Modal
      modalId={Modals.ADD_ACCOUNT_BALANCE}
      title="Agregar saldo"
      className="md:max-w-md!"
      onClose={handleClose}
    >
      <FormWrapper form={form} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1 rounded-md border border-border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo actual</span>
            <span className="font-semibold">{formatCurrency(current, "PEN")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo final estimado</span>
            <span className="font-semibold">{formatCurrency(nextBalance, "PEN")}</span>
          </div>
        </div>

        <div className="space-y-2">
         

          <InputForm
            label="Monto a agregar (S/)"
            name="amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            autoFocus
          />

          <InputForm
            label="Nota (opcional)"
            name="note"
            type="text"
            placeholder="Ej: ajuste inicial, recarga, etc."
          />
        </div>

        <Modal.Footer className="grid-cols-2">
          <Button type="button" onClick={handleClose} variant="outline">
            Cancelar
          </Button>
          <Button type="submit">Agregar</Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
