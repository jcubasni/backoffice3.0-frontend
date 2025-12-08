"use client"

import { CreateClientSchema } from "@accounts/schemas/create-client.schema"
import { useGetDocumentTypes } from "@common/hooks/useCommonService"
import { useSearchDocument } from "@common/hooks/useSearchPerson"
import { DocumentTypeCode } from "@common/types/common.type"
import { Search } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"
import { cn } from "@/lib/utils"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { InputForm } from "@/shared/components/form/input-form"
import { dataToCombo } from "@/shared/lib/combo-box"

export function ClientInfo() {
  const form = useFormContext<CreateClientSchema>()
  const documentTypes = useGetDocumentTypes()
  const [documentType, documentNumber] = useWatch({
    control: form.control,
    name: ["documentType", "documentNumber"],
  })

  const handleSearchWithValidation = async () => {
    const isValid = await form.trigger(["documentType", "documentNumber"])
    return isValid
  }

  const { handleSearch, handleKeyDown } = useSearchDocument({
    documentType,
    documentNumber,
    shouldValidate: handleSearchWithValidation,
    onSuccess: (data) => {
      const { firstName, lastName, fiscalAddress: address } = data

      // Establecer valores individuales en el formulario
      form.setValue("firstName", firstName)
      form.setValue("lastName", lastName ?? "")
      form.setValue("address", address ?? "")
    },
  })

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      <h2 className="col-span-full font-bold text-foreground text-xl">
        Información Personal
      </h2>

      <ComboBoxForm
        name="documentType"
        label="Tipo de documento"
        className="w-full!"
        options={dataToCombo(documentTypes.data, "id", "name")}
        onSelect={() => form.trigger("documentNumber")}
      />
      <InputForm
        name="documentNumber"
        label="N° documento"
        icon={Search}
        iconClick={handleSearch}
        onKeyDown={handleKeyDown}
      />

      <InputForm
        label={
          documentType !== DocumentTypeCode.RUC ? "Nombres" : "Razón social"
        }
        classContainer={cn(
          documentType !== DocumentTypeCode.RUC
            ? "col-span-1"
            : "col-span-full",
        )}
        name="firstName"
      />
      <InputForm
        label="Apellidos"
        name="lastName"
        classContainer={cn(
          documentType !== DocumentTypeCode.RUC ? "col-span-1" : "hidden",
        )}
      />
      <InputForm label="Direccion" name="address" classContainer="col-span-2" />
      <InputForm label="Departamento" name="department" />
      <InputForm label="Provincia" name="province" />
      <InputForm label="Distrito" name="district" />
      <InputForm label="Correo electronico" name="email" />
      <InputForm label="Teléfono" name="phone" />
    </div>
  )
}
