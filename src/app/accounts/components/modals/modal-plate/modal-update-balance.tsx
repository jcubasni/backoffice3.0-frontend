"use client"

import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { formatCurrency } from "@/shared/lib/number"


// ✅ CAMBIA este hook por el tuyo real (assign-balance)
import { useAssignPlateBalance } from "@/app/accounts/hooks/usePlatesServicec"


type UpdateBalanceModalProp = {
  accountCardId: string
  currentBalance: number
}

const addBalanceSchema = z.object({
  amount: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  note: z.string().optional(),
})

type AddBalanceData = z.infer<typeof addBalanceSchema>

export default function ModalUpdateBalance() {
  const modalData = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.UPDATE_BALANCE),
  )?.prop as UpdateBalanceModalProp | undefined

  const { closeModal } = useModalStore()

  const accountCardId = modalData?.accountCardId ?? ""
  const currentBalance = modalData?.currentBalance ?? 0

  const assignBalance = useAssignPlateBalance()

  const form = useForm<AddBalanceData>({
    resolver: zodResolver(addBalanceSchema),
    defaultValues: { amount: 0, note: "" },
  })

  // ✅ Cada vez que se abre el modal, resetea limpio
  useEffect(() => {
    if (!modalData) return
    form.reset({ amount: 0, note: "" })
  }, [modalData, form])

  const amount = form.watch("amount") ?? 0

  const nextBalance = useMemo(() => {
    const a = Number.isFinite(amount) ? Number(amount) : 0
    return currentBalance + a
  }, [currentBalance, amount])

 const onSubmit = (data: AddBalanceData) => {
  if (!accountCardId) return

  assignBalance.mutate(
    {
      accountCardId,
      body: {
        amount: data.amount,
        note: data.note?.trim() || undefined,
      },
    },
    {
      onSuccess: () => {
        closeModal(Modals.UPDATE_BALANCE)
        form.reset({ amount: 0, note: "" })
      },
    },
  )
}

  if (!modalData) return null

  return (
    <Modal
      modalId={Modals.UPDATE_BALANCE}
      title="Agregar saldo"
      className="overflow-y-auto sm:w-[420px]"
      onClose={() => closeModal(Modals.UPDATE_BALANCE)}
    >
      <FormWrapper form={form} onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1 rounded-md border border-border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo actual</span>
            <span className="font-semibold">{formatCurrency(currentBalance, "PEN")}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo final estimado</span>
            <span className="font-semibold">{formatCurrency(nextBalance, "PEN")}</span>
          </div>
        </div>

        <InputForm
          label="Monto a agregar"
          name="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          autoFocus
        />

        <InputForm
          label="Nota (opcional)"
          name="note"
          type="text"
          placeholder="Ej: recarga, ajuste, etc."
        />

        <Modal.Footer className="grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal(Modals.UPDATE_BALANCE)}
            disabled={assignBalance.isPending}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={assignBalance.isPending}>
            {assignBalance.isPending ? "Guardando..." : "Agregar"}
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
