import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { CheckBoxForm } from "@/shared/components/form/checkbox-form"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { InputForm } from "@/shared/components/form/input-form"
import { MultiSelectForm } from "@/shared/components/form/multi-select-form"
import Modal from "@/shared/components/ui/modal"
import { Modals } from "../../lib/product-modals-name"
import { type AddProduct, addProductSchema } from "../../schemas/product.schema"

export default function ModalAddProducts() {
  const form = useForm<AddProduct>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      manageStock: false,
      stock: 0,
    },
  })

  const onSubmit = async (data: AddProduct) => {
    console.log(data)
  }

  // TODO: Reemplazar con datos reales del API
  const groupProductOptions = [
    { value: "1", label: "Grupo 1" },
    { value: "2", label: "Grupo 2" },
  ]

  // TODO: Reemplazar con datos reales del API (sedes/locales)
  const localOptions = [
    { value: "d8d25d08-418b-4881-815a-7706ba9e3950", label: "Sede 1" },
    { value: "0310140f-447f-4aed-ae05-2e00febba832", label: "Sede 2" },
  ]

  return (
    <Modal
      modalId={Modals.ADD_PRODUCT}
      title="CREAR PRODUCTO"
      className="sm:max-w-180"
    >
      <FormWrapper
        form={form}
        onSubmit={onSubmit}
        className="grid grid-cols-2 gap-4"
      >
        <InputForm
          name="foreignName"
          label="Nombre producto:"
          placeholder="Ej: ACEITE34"
          className="col-span-full"
        />
        <InputForm
          name="description"
          label="Descripción:"
          placeholder="Ej: Aceite Premium52"
          className="col-span-full"
        />
        <InputForm
          name="measurementUnit"
          label="Unidad de medida:"
          placeholder="Ej: GLL, LTS, UND"
        />
        <InputForm
          name="price"
          label="Precio:"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
        />
        <ComboBoxForm
          name="groupProductId"
          label="Grupo de producto:"
          options={groupProductOptions}
          placeholder="Seleccionar grupo"
          className="w-full!"
        />
        <InputForm
          name="stock"
          label="Stock inicial:"
          type="number"
          min="0"
          placeholder="0"
        />
        <CheckBoxForm
          name="manageStock"
          label="Manejar inventario"
          classContainer="col-span-full"
        />
        <MultiSelectForm
          name="localIds"
          label="Sedes:"
          options={localOptions}
          placeholder="Seleccionar sedes"
          classContainer="col-span-full"
        />
        <Modal.Footer className="col-span-full">
          <Button type="submit" className="w-full md:w-auto">
            Guardar producto
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  )
}
