import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, QrCode, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"

import { useGetProducts } from "@/app/products/hooks/useProductsService"
import { useAddPlates } from "@/app/accounts/hooks/usePlatesServicec"
import { generateCardNumber } from "@/app/accounts/lib/plates"
import {
  type PlateArrayData,
  plateArraySchema,
} from "@/app/accounts/schemas/plate.schema"
import { Modals } from "@/app/accounts/types/modals-name"
import type { AddPlateDTO } from "@/app/accounts/types/plate.type"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"

// 👇 Vehículos del módulo Vehículos
import { useGetVehicles } from "@/app/vehicles/hooks/useVehiclesService"

export default function ModalAddPlate() {
  // Puede ser string | undefined
  const accountId = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === Modals.ADD_PLATE,
  )?.prop as string | undefined

  const productsQuery = useGetProducts()
  const vehiclesQuery = useGetVehicles({
    page: 1,
    limit: 1000,
  })

  // 🔹 IMPORTANTE: pasamos accountId al hook
  const addPlates = useAddPlates(accountId)

  const form = useForm<PlateArrayData>({
    resolver: zodResolver(plateArraySchema),
    defaultValues: {
      plates: [{ plate: "", cardNumber: "", productId: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "plates",
  })

  const handleGenerateCardNumber = (index: number) => {
    const plateValue = form.getValues(`plates.${index}.plate`)
    if (plateValue) {
      const cardNumber = generateCardNumber(plateValue)
      form.setValue(`plates.${index}.cardNumber`, cardNumber)
    }
  }

  const onSubmit = (data: PlateArrayData) => {
    if (!accountId) {
      console.error("accountId no definido al abrir el modal de placas")
      return
    }

    // 👇 AddPlateDTO SOLO lleva cards
    const payload: AddPlateDTO = {
      cards: data.plates.map((plate) => ({
        licensePlate: plate.plate,
        cardNumber: plate.cardNumber,
        balance: 0, // por ahora 0
        productIds: plate.productId ? [plate.productId] : [],
      })),
    }

    addPlates.mutate(payload)
  }

  return (
    <Modal
      modalId={Modals.ADD_PLATE}
      title="Agregar placa"
      className="overflow-y-auto sm:w-[600px]"
      scrollable
    >
      {/* Solo como referencia/debug, no visible */}
      <Input orientation="horizontal" value={accountId ?? ""} disabled hidden />

      <FormWrapper form={form} onSubmit={onSubmit}>
        {fields.map((field, index) => (
          <>
            <div key={field.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Placa {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <section className="grid grid-cols-2 gap-4">
                {/* 🔹 PLACA: viene del módulo Vehículos */}
                <ComboBoxForm
                  name={`plates.${index}.plate` as const}
                  label="Placa"
                  classContainer="col-span-2"
                  className="w-full!"
                  searchable
                  options={dataToCombo(
                    vehiclesQuery.data?.rows ?? [],
                    "plate", // value
                    "plate", // label
                  )}
                />

                <InputForm
                  name={`plates.${index}.cardNumber` as const}
                  label="Tarjeta:"
                  readOnly
                  icon={QrCode}
                  iconClick={() => handleGenerateCardNumber(index)}
                />

                <ComboBoxForm
                  name={`plates.${index}.productId` as const}
                  label="Producto"
                  classContainer="col-span-2"
                  className="w-full!"
                  searchable
                  options={dataToCombo(
                    productsQuery.data ?? [],
                    "productId",
                    "description",
                  )}
                />
              </section>
            </div>
            {index !== fields.length - 1 && <Separator />}
          </>
        ))}

        <Button
          type="button"
          className="mt-2 ml-auto w-fit"
          onClick={() => append({ plate: "", cardNumber: "", productId: 0 })}
        >
          <Plus /> Agregar otra placa
        </Button>

        <Modal.Footer>
          <Button type="submit" variant="outline" disabled={!accountId}>
            Guardar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
