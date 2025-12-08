"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Search } from "lucide-react"

import { CreateEmployedSchema } from "@/app/employed/schemas/create-employed.schema"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { InputForm } from "@/shared/components/form/input-form"
import { dataToCombo } from "@/shared/lib/combo-box"
import { cn } from "@/lib/utils"

// 🔹 Puedes usar el mismo endpoint de tipos de documento que clientes (solo maquetado)
import { useGetDocumentTypes } from "@/app/common/hooks/useCommonService"

// 🔹 Si luego quieres implementar búsqueda por documento, aquí podemos reutilizar el hook
// import { useSearchDocument } from "@/app/common/hooks/useSearchPerson"

export function EmployedInfo() {
  const form = useFormContext<CreateEmployedSchema>()

  const documentTypes = useGetDocumentTypes()

  const [documentType, documentNumber] = useWatch({
    control: form.control,
    name: ["documentType", "documentNumber"],
  })

  // Si quieres activar la búsqueda del empleado por DNI/RUC más adelante,
  // aquí podemos habilitarlo como en clientes.
  const handleSearch = () => {
    console.log("🔍 Buscar empleado por documento:", {
      documentType,
      documentNumber,
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      <h2 className="col-span-full font-bold text-foreground text-xl">
        Información del Empleado
      </h2>

      {/* TIPO DE DOCUMENTO */}
      <ComboBoxForm
        name="documentType"
        label="Tipo de documento"
        className="w-full!"
        options={dataToCombo(documentTypes.data, "id", "name")}
        onSelect={() => form.trigger("documentNumber")}
      />

      {/* NÚMERO DE DOCUMENTO */}
      <InputForm
        name="documentNumber"
        label="N° documento"
        icon={Search}
        iconClick={handleSearch}
      />

      {/* NOMBRES */}
      <InputForm
        label="Nombres"
        name="firstName"
      />

      {/* APELLIDOS */}
      <InputForm
        label="Apellidos"
        name="lastName"
      />

      {/* DIRECCIÓN */}
      <InputForm
        label="Dirección"
        name="address"
        classContainer="col-span-2"
      />

      {/* CORREO */}
      <InputForm
        label="Correo electrónico"
        name="email"
      />

      {/* TELÉFONO */}
      <InputForm
        label="Teléfono"
        name="phone"
      />
    </div>
  )
}
