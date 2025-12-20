"use client"

import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"
import { formatCurrency } from "@/shared/lib/number"

import { useAssignPlateBalance } from "@/app/accounts/hooks/usePlatesServicec"

type UpdateBalanceModalProp = {
  accountId: string
  accountCardId: string
  currentCardBalance?: number
  availableAccountBalance?: number
}

/**
 * Front: nota opcional (UX)
 * Backend: nota obligatoria (validación)
 * => Solución: si el usuario no escribe nota, enviamos un valor por defecto.
 */
const schema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, "El monto debe ser mayor a 0"),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const DEFAULT_NOTE = "Recarga"

export default function ModalUpdateBalance() {
  const modalData = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.UPDATE_BALANCE),
  )?.prop as UpdateBalanceModalProp | undefined

  const { closeModal } = useModalStore()
  const assignBalance = useAssignPlateBalance()

  const accountId = modalData?.accountId ?? ""
  const accountCardId = modalData?.accountCardId ?? ""
  const currentCardBalance = modalData?.currentCardBalance ?? 0
  const availableAccountBalance = modalData?.availableAccountBalance

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, note: "" },
    mode: "onChange",
  })

  const amount = useWatch({ control: form.control, name: "amount" }) ?? 0

  useEffect(() => {
    if (!modalData) return
    form.reset({ amount: 0, note: "" })
  }, [modalData, form])

  const nextCardBalance = useMemo(() => {
    const a = Number.isFinite(amount) ? Number(amount) : 0
    return currentCardBalance + a
  }, [currentCardBalance, amount])

  const willExceed =
    typeof availableAccountBalance === "number" && amount > availableAccountBalance

  const handleClose = () => {
    closeModal(Modals.UPDATE_BALANCE)
    form.reset({ amount: 0, note: "" })
  }

  const onSubmit = (data: FormData) => {
    if (!accountId || !accountCardId) return

    // ✅ Validación UI (además del backend)
    if (typeof availableAccountBalance === "number" && data.amount > availableAccountBalance) {
      form.setError("amount", {
        type: "manual",
        message: `Saldo insuficiente. Disponible ${formatCurrency(
          availableAccountBalance,
          "PEN",
        )}`,
      })
      return
    }

    // ✅ Nota opcional en UI, pero siempre no-vacía en request
    const noteToSend =
      data.note?.trim() && data.note.trim().length > 0 ? data.note.trim() : DEFAULT_NOTE

    assignBalance.mutate(
      {
        accountId,
        body: {
          cardId: accountCardId, // ✅ backend: "cardId" = accountCardId
          amount: data.amount,
          note: noteToSend,
        },
      },
      {
        onSuccess: () => {
          handleClose()
        },
      },
    )
  }

  if (!modalData) return null

  return (
    <Modal
      modalId={Modals.UPDATE_BALANCE}
      title="Agregar saldo a tarjeta"
      className="overflow-y-auto sm:w-[440px]"
      onClose={handleClose}
    >
      <FormWrapper form={form} onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2 rounded-md border border-border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo actual (tarjeta)</span>
            <span className="font-semibold">
              {formatCurrency(currentCardBalance, "PEN")}
            </span>
          </div>

          {typeof availableAccountBalance === "number" && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Disponible (cuenta)</span>
              <span className="font-semibold">
                {formatCurrency(availableAccountBalance, "PEN")}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo final (tarjeta)</span>
            <span className="font-semibold">
              {formatCurrency(nextCardBalance, "PEN")}
            </span>
          </div>

          {willExceed && (
            <p className="text-xs text-destructive">
              El monto excede el saldo disponible de la cuenta.
            </p>
          )}
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
          placeholder={`Ej: ${DEFAULT_NOTE}`}
        />

        <Modal.Footer className="grid-cols-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={assignBalance.isPending}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={assignBalance.isPending || willExceed}
          >
            {assignBalance.isPending ? "Guardando..." : "Agregar"}
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
