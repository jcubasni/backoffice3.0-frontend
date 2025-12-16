"use client"

import { useEffect } from "react"
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

type UpdateBalanceModalProp = {
  accountCardId: string
  currentBalance: number
}

export default function ModalUpdateBalance() {
  const modalData = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.UPDATE_BALANCE),
  )?.prop as UpdateBalanceModalProp | undefined

  const accountCardId = modalData?.accountCardId ?? ""
  const currentBalance = modalData?.currentBalance ?? 0

  const editPlate = useEditPlate()

  const form = useForm<PlateBalanceData>({
    resolver: zodResolver(PlateBalanceSchema),
    defaultValues: {
      balance: currentBalance,
    },
  })

  // Cuando cambie el saldo que viene de la tarjeta, actualizamos el form
  useEffect(() => {
    if (modalData) {
      form.reset({
        balance: modalData.currentBalance,
      })
    }
  }, [modalData, form])

  const onSubmit = (data: PlateBalanceData) => {
    if (!accountCardId) {
      console.error("accountCardId no definido en ModalUpdateBalance")
      return
    }

    editPlate.mutate({
      accountCardId,
      body: {
        balance: data.balance,
      },
    })
  }

  // Si por algún motivo no hay data, no renderizamos el modal
  if (!modalData) return null

  return (
    <Modal
      modalId={Modals.UPDATE_BALANCE}
      title="Agregar saldo"
      className="overflow-y-auto sm:w-[380px]"
    >
      <FormWrapper form={form} onSubmit={onSubmit}>
        <InputForm
          label="Saldo"
          name="balance"
          type="number"
          step="0.01"
        />

        <Modal.Footer>
          <Button
            type="submit"
            variant="outline"
            disabled={editPlate.isPending}
          >
            {editPlate.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
