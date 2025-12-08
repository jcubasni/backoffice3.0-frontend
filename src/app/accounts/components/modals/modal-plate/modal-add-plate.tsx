import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, QrCode, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { useGetProductsByAccount } from "@/app/accounts/hooks/useClientsService"
import { useAddPlates } from "@/app/accounts/hooks/usePlatesServicec"
import { generateCardNumber } from "@/app/accounts/lib/plates"
import {
  type PlateArrayData,
  plateArraySchema,
} from "@/app/accounts/schemas/plate.schema"
import { Modals } from "@/app/accounts/types/modals-name"
import { AddPlateDTO, CardType } from "@/app/accounts/types/plate.type"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { Input } from "@/shared/components/ui/input"
import Modal from "@/shared/components/ui/modal"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"

export default function ModalAddPlate() {
  const accountId = useModalStore((state) => state.openModals).find(
    (modal) => modal.id === Modals.ADD_PLATE,
  )?.prop as string
  const products = useGetProductsByAccount(accountId)
  const addPlates = useAddPlates()

  const form = useForm<PlateArrayData>({
    resolver: zodResolver(plateArraySchema),
    defaultValues: {
      plates: [{ plate: "", cardNumber: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "plates",
  })

  const handlePlateChange = (index: number, value: string) => {
    // Convert to uppercase and remove invalid characters (keep hyphen)
    let formattedValue = value.toUpperCase().replace(/[^A-Z0-9-]/g, "")

    // Remove multiple hyphens and keep only one
    formattedValue = formattedValue.replace(/-+/g, "-")

    // Auto-format: add hyphen after 3 characters if not present
    if (formattedValue.length > 3 && !formattedValue.includes("-")) {
      formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 6)}`
    }

    // Limit to XXX-XXX format (7 characters max)
    if (formattedValue.length > 7) {
      formattedValue = formattedValue.slice(0, 7)
    }

    // Update the plate field with formatted value
    form.setValue(`plates.${index}.plate`, formattedValue)
  }

  const handleGenerateCardNumber = (index: number) => {
    const plateValue = form.getValues(`plates.${index}.plate`)
    if (plateValue) {
      const cardNumber = generateCardNumber(plateValue)
      form.setValue(`plates.${index}.cardNumber`, cardNumber)
    }
  }

  const onSubmit = (data: PlateArrayData) => {
    const payload: AddPlateDTO = {
      cards: data.plates.map((plate) => ({
        accountId,
        cardTypeId: CardType.INTERNO,
        plate: plate.plate,
        cardNumber: plate.cardNumber,
        balance: 0,
        productId: plate.productId,
      })),
    }
    addPlates.mutate(payload)
  }

  return (
    <Modal
      modalId={Modals.ADD_PLATE}
      title="Agregar placa"
      className="overflow-y-auto sm:w-[600px]"
      scrollable={true}
    >
      <Input orientation="horizontal" value={accountId} disabled hidden />
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
                <InputForm
                  name={`plates.${index}.plate` as any}
                  label="Placa:"
                  maxLength={7}
                  placeholder="ABC-123"
                  onChange={(e) => handlePlateChange(index, e.target.value)}
                />

                <InputForm
                  name={`plates.${index}.cardNumber` as any}
                  label="Tarjeta:"
                  readOnly
                  icon={QrCode}
                  iconClick={() => handleGenerateCardNumber(index)}
                />

                <ComboBoxForm
                  name={`plates.${index}.productId` as any}
                  label="Producto"
                  classContainer="col-span-2"
                  className="w-full!"
                  options={dataToCombo(
                    products.data,
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
          <Button type="submit" variant="outline">
            Guardar
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
