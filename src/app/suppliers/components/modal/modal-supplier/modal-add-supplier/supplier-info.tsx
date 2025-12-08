"use client"

import { useFormContext } from "react-hook-form"
import { InputForm } from "@/shared/components/form/input-form"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { dataToCombo } from "@/shared/lib/combo-box"
import { useGetDocumentTypes } from "@/app/common/hooks/useCommonService"
import { CreateSupplierSchema } from "@/app/suppliers/schemas/create-supplier.schema"

export function SupplierInfo() {
  const form = useFormContext<CreateSupplierSchema>()
  const documentTypes = useGetDocumentTypes()

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      <h2 className="col-span-full font-bold text-foreground text-xl">
        Información del Proveedor
      </h2>

      <ComboBoxForm
        name="documentType"
        label="Tipo de documento"
        options={dataToCombo(documentTypes.data, "id", "name")}
        onSelect={() => form.trigger("documentNumber")}
      />

      <InputForm name="documentNumber" label="N° documento" />

      <InputForm
        name="businessName"
        label="Razón Social"
        classContainer="col-span-2"
      />

      <InputForm name="contactName" label="Nombre de contacto" />
      <InputForm name="email" label="Correo electrónico" />
      <InputForm name="phone" label="Teléfono" />
      <InputForm name="address" label="Dirección" classContainer="col-span-2" />
    </div>
  )
}
