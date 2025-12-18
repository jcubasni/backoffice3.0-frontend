"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { DollarSign, Plus, QrCode, Trash2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useFieldArray, useForm } from "react-hook-form"

import { useGetProducts } from "@/app/products/hooks/useProductsService"
import { useAddPlates } from "@/app/accounts/hooks/usePlatesServicec"
import { generateCardNumber } from "@/app/accounts/lib/plates"
import { type PlateArrayData, plateArraySchema } from "@/app/accounts/schemas/plate.schema"
import { Modals } from "@/app/accounts/types/modals-name"
import type { AddPlateDTO } from "@/app/accounts/types/plate.type"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"

import { useGetVehicles } from "@/app/vehicles/hooks/useVehiclesService"

const EMPTY_ROW: PlateArrayData["plates"][number] = {
  plate: "",
  cardNumber: "",
  balance: 0,
  productId: 0,
}

export default function ModalAddPlate() {
  const accountId = useModalStore((state) =>
    state.openModals.find((modal) => modal.id === Modals.ADD_PLATE),
  )?.prop as string | undefined

  const productsQuery = useGetProducts()
  const vehiclesQuery = useGetVehicles({ page: 1, limit: 1000 })

  const addPlates = useAddPlates(accountId)

  const form = useForm<PlateArrayData>({
    resolver: zodResolver(plateArraySchema),
    defaultValues: { plates: [EMPTY_ROW] },
    mode: "onChange",
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "plates",
  })

  const isLoadingCombos = productsQuery.isLoading || vehiclesQuery.isLoading
  const isSaving = addPlates.isPending

  const vehicleOptions = useMemo(
    () => dataToCombo(vehiclesQuery.data?.rows ?? [], "plate", "plate"),
    [vehiclesQuery.data],
  )

  const productOptions = useMemo(
    () => dataToCombo(productsQuery.data ?? [], "productId", "description"),
    [productsQuery.data],
  )

  // ✅ Cuando se abre el modal (accountId disponible), reset limpio
  useEffect(() => {
    if (!accountId) return
    replace([EMPTY_ROW])
    form.reset({ plates: [EMPTY_ROW] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  const handleGenerateCardNumber = (index: number) => {
    const plateValue = form.getValues(`plates.${index}.plate`)
    if (!plateValue) return

    const cardNumber = generateCardNumber(plateValue)

    form.setValue(`plates.${index}.cardNumber`, cardNumber, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const onSubmit = (data: PlateArrayData) => {
    if (!accountId) return

    const payload: AddPlateDTO = {
      cards: data.plates.map((p) => ({
        licensePlate: p.plate,
        cardNumber: p.cardNumber,
        balance: p.balance ?? 0,
        productIds: p.productId ? [p.productId] : [],
      })),
    }

    addPlates.mutate(payload)
  }

  const canSubmit = !!accountId && !isLoadingCombos && !isSaving

  return (
    <Modal
      modalId={Modals.ADD_PLATE}
      title="Agregar placa"
      className="overflow-y-auto sm:w-[600px]"
      scrollable
      onClose={() => {
        // ✅ al cerrar, lo dejamos limpio para la próxima apertura
        replace([EMPTY_ROW])
        form.reset({ plates: [EMPTY_ROW] })
      }}
    >
      <FormWrapper form={form} onSubmit={onSubmit} className="space-y-4">
        {fields.map((field, index) => {
          const plateSelected = !!form.watch(`plates.${index}.plate`)

          return (
            <div key={field.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Placa {index + 1}</h4>

                {fields.length > 1 && (
                  <Button type="button" size="icon" onClick={() => remove(index)} disabled={isSaving}>
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <section className="grid grid-cols-2 gap-4">
                <ComboBoxForm
                  name={`plates.${index}.plate` as const}
                  label="Placa"
                  classContainer="col-span-1"
                  className="w-full!"
                  searchable
                  disabled={isSaving}
                  options={vehicleOptions}
                />

                <InputForm
                  name={`plates.${index}.cardNumber` as const}
                  label="Tarjeta"
                  readOnly
                  icon={QrCode}
                  iconClick={() => handleGenerateCardNumber(index)}
                  // ✅ evita generar si no hay placa seleccionada
                  disabled={isSaving || !plateSelected}
                />

                <InputForm
                  name={`plates.${index}.balance` as const}
                  label="Saldo inicial (S/)"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  icon={DollarSign}
                  disabled={isSaving}
                />

                <ComboBoxForm
                  name={`plates.${index}.productId` as const}
                  label="Producto"
                  classContainer="col-span-2"
                  className="w-full!"
                  searchable
                  disabled={isSaving}
                  options={productOptions}
                />
              </section>

              {index !== fields.length - 1 && <Separator />}
            </div>
          )
        })}

        <Button
          type="button"
          className="ml-auto w-fit"
          onClick={() => append(EMPTY_ROW)}
          disabled={isSaving}
        >
          <Plus /> Agregar otra placa
        </Button>

        <Modal.Footer>
          <Button type="submit" variant="outline" disabled={!canSubmit}>
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
