"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Save } from "lucide-react"

import { useUpdateAccount } from "@accounts/hooks/useClientsService"
import { Modals } from "@accounts/types/modals-name"

import { Button } from "@/components/ui/button"
import { InputForm } from "@/shared/components/form/input-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import Modal from "@/shared/components/ui/modal"
import { useModalStore } from "@/shared/store/modal.store"

type EditAccountForm = {
  creditLine: string
  creditDays: string
  billingDays: string
  installments: string
  startDate: string
  endDate: string
}

// 👇 Tipo de lo que mandamos en openModal desde ClientAccountsEdit
type EditAccountModalData = {
  accountId: string
  clientId: string
  creditLine?: number
  creditDays?: number
  billingDays?: number
  installments?: number
  startDate?: string
  endDate?: string
  status?: boolean
}

export default function ModalEditAccount() {
  const modalState = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.EDIT_ACCOUNT),
  )

  const dataModal = modalState?.prop as EditAccountModalData | undefined
  const closeModal = useModalStore((state) => state.closeModal)

  const { mutate, isPending } = useUpdateAccount()

  const form = useForm<EditAccountForm>({
    mode: "onChange",
    defaultValues: {
      creditLine: "",
      creditDays: "",
      billingDays: "",
      installments: "",
      startDate: "",
      endDate: "",
    },
  })

  const { reset, handleSubmit } = form

  // 🔵 Cargar datos iniciales en el formulario
  useEffect(() => {
    if (!dataModal) return

    reset({
      creditLine: dataModal.creditLine?.toString() ?? "",
      creditDays: dataModal.creditDays?.toString() ?? "",
      billingDays: dataModal.billingDays?.toString() ?? "",
      installments: dataModal.installments?.toString() ?? "",
      startDate: dataModal.startDate ?? "",
      endDate: dataModal.endDate ?? "",
    })
  }, [dataModal, reset])

  if (!dataModal) return null

  const onSubmit = (values: EditAccountForm) => {
    const { accountId, clientId } = dataModal

    if (!accountId || !clientId) return

    const payload = {
      creditLine: values.creditLine ? Number(values.creditLine) : undefined,
      creditDays: values.creditDays ? Number(values.creditDays) : undefined,
      billingDays: values.billingDays ? Number(values.billingDays) : undefined,
      installments: values.installments
        ? Number(values.installments)
        : undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    }

    // 🔁 Llamamos al hook de actualización
    mutate(
      {
        accountId,
        clientId,
        data: payload,
      },
      {
        onSuccess: () => {
          // Cerramos modal al guardar correctamente
          closeModal(Modals.EDIT_ACCOUNT)
        },
      },
    )
  }

  return (
    <Modal
      modalId={Modals.EDIT_ACCOUNT}
      title="Editar cuenta"
      className="w-full max-w-lg p-2 md:p-4"
    >
      <FormWrapper
        form={form}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        {/* Puedes mostrar un pequeño resumen arriba */}
        <div className="rounded-md bg-muted p-3 text-sm">
          <p>
            <span className="font-semibold">Cuenta:</span>{" "}
            {dataModal.accountId}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputForm
            name="creditLine"
            label="Línea de crédito"
            type="number"
          />
          <InputForm
            name="balance"
            label="Saldo"
            disabled
            classContainer="hidden"
          />

          <InputForm
            name="creditDays"
            label="Días de crédito"
            type="number"
          />
          <InputForm
            name="billingDays"
            label="Días de facturación"
            type="number"
          />

          <InputForm
            name="installments"
            label="Cuotas"
            type="number"
          />

          <InputForm
            name="startDate"
            label="Fecha inicio"
            type="date"
          />
          <InputForm
            name="endDate"
            label="Fecha fin"
            type="date"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal(Modals.EDIT_ACCOUNT)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </FormWrapper>
    </Modal>
  )
}
