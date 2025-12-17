"use client"

import { useEffect } from "react"
import { Search } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"

import { CreateClientSchema } from "@accounts/schemas/create-client.schema"
import { useGetDocumentTypes } from "@common/hooks/useCommonService"
import { useSearchDocument } from "@common/hooks/useSearchPerson"
import { DocumentTypeCode } from "@common/types/common.type"

import { cn } from "@/lib/utils"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { InputForm } from "@/shared/components/form/input-form"
import { dataToCombo } from "@/shared/lib/combo-box"

import {
  useGetDepartments,
  useGetDistricts,
  useGetProvinces,
} from "@/app/accounts/hooks/useUbigeoService"

export function ClientInfo() {
  const form = useFormContext<CreateClientSchema>()
  const documentTypes = useGetDocumentTypes()

  const [documentType, documentNumber, departmentId, provinceId] = useWatch({
    control: form.control,
    name: ["documentType", "documentNumber", "departmentId", "provinceId"],
  })

  // ✅ queries Ubigeo
  const departmentsQuery = useGetDepartments()
  const provincesQuery = useGetProvinces(departmentId)
  const districtsQuery = useGetDistricts(departmentId, provinceId)

  // ✅ reset cascada
  useEffect(() => {
    form.setValue("provinceId", "")
    form.setValue("districtId", "")
    form.trigger(["provinceId", "districtId"])
  }, [departmentId, form])

  useEffect(() => {
    form.setValue("districtId", "")
    form.trigger("districtId")
  }, [provinceId, form])

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
      form.setValue("firstName", firstName)
      form.setValue("lastName", lastName ?? "")
      form.setValue("address", address ?? "")
      form.trigger(["firstName", "lastName", "address"])
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
        searchable
        options={dataToCombo(documentTypes.data, "id", "name")}
        onSelect={(value) => {
          // asegura que RHF tenga el valor (por si ComboBoxForm no hace field.onChange internamente)
          form.setValue("documentType", value as any)
          form.trigger("documentNumber")
        }}
      />

      <InputForm
        name="documentNumber"
        label="N° documento"
        icon={Search}
        iconClick={handleSearch}
        onKeyDown={handleKeyDown}
      />

      <InputForm
        label={documentType !== DocumentTypeCode.RUC ? "Nombres" : "Razón social"}
        classContainer={cn(
          documentType !== DocumentTypeCode.RUC ? "col-span-1" : "col-span-full",
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

      {/* ✅ Departamento */}
      <ComboBoxForm
        name="departmentId"
        label="Departamento"
        className="w-full!"
        searchable
        options={dataToCombo(departmentsQuery.data ?? [], "id", "name")}
      />

      {/* ✅ Provincia */}
      <ComboBoxForm
        name="provinceId"
        label="Provincia"
        className="w-full!"
        searchable
        disabled={!departmentId}
        options={dataToCombo(provincesQuery.data ?? [], "id", "name")}
      />

      {/* ✅ Distrito */}
      <ComboBoxForm
        name="districtId"
        label="Distrito"
        className="w-full!"
        searchable
        disabled={!provinceId}
        options={dataToCombo(districtsQuery.data ?? [], "id", "name")}
      />

      <InputForm label="Correo electronico" name="email" />
      <InputForm label="Teléfono" name="phone" />
    </div>
  )
}
