"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { InputForm } from "@/shared/components/form/input-form"
import { dataToCombo } from "@/shared/lib/combo-box"

import { CreateEmployedSchema } from "@/app/employed/schemas/create-employed.schema"
import { useGetDocumentTypes } from "@/app/common/hooks/useCommonService"

export function EmployedInfo() {
  const form = useFormContext<CreateEmployedSchema>()
  const documentTypes = useGetDocumentTypes()

  const [documentType] = useWatch({
    control: form.control,
    name: ["documentType"],
  })

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      <h2 className="col-span-full font-bold text-foreground text-xl">
        Información Personal
      </h2>

      {/* Tipo documento */}
      <ComboBoxForm
        name="documentType"
        label="Tipo de documento"
        className="w-full!"
        options={dataToCombo(documentTypes.data, "id", "name")}
      />

      {/* Documento */}
      <InputForm
        name="documentNumber"
        label="N° documento"
        icon={Search}
      />

      {/* Nombre */}
      <InputForm
        label="Nombres"
        name="firstName"
        classContainer="col-span-1"
      />

      {/* Apellidos */}
      <InputForm
        label="Apellidos"
        name="lastName"
        classContainer="col-span-1"
      />

      {/* Dirección */}
      <InputForm label="Dirección" name="address" classContainer="col-span-2" />

      {/* Ubicación */}
      <InputForm label="Departamento" name="department" />
