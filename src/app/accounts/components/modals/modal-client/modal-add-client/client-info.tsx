"use client"

import { useEffect, useMemo } from "react"
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
  const departmentsQuery = useGetDepartments()

  const [documentType, documentNumber, departmentId, provinceId] = useWatch({
    control: form.control,
    name: ["documentType", "documentNumber", "departmentId", "provinceId"],
  })

  const provincesQuery = useGetProvinces(departmentId)
  const districtsQuery = useGetDistricts(departmentId, provinceId)

  // ✅ options memoizadas (IMPORTANTE)
  const documentTypeOptions = useMemo(
    () => dataToCombo(documentTypes.data ?? [], "id", "name"),
    [documentTypes.data],
  )

  const departmentOptions = useMemo(
    () => dataToCombo(departmentsQuery.data ?? [], "id", "name"),
    [departmentsQuery.data],
  )

  const provinceOptions = useMemo(
    () => dataToCombo(provincesQuery.data ?? [], "id", "name"),
    [provincesQuery.data],
  )

  const districtOptions = useMemo(
    () => dataToCombo(districtsQuery.data ?? [], "id", "name"),
    [districtsQuery.data],
  )

  // ✅ reset cascada (con guardas)
  useEffect(() => {
    const currentProvince = form.getValues("provinceId")
    const currentDistrict = form.getValues("districtId")

    if (currentProvince) form.setValue("provinceId", "")
    if (currentDistrict) form.setValue("districtId", "")
  }, [departmentId, form])

  useEffect(() => {
    const currentDistrict = form.getValues("districtId")
    if (currentDistrict) form.setValue("districtId", "")
  }, [provinceId, form])

  const handleSearchWithValidation = async () => {
    return form.trigger(["documentType", "documentNumber"])
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
        options={documentTypeOptions}
        // ✅ NO vuelvas a setValue manualmente (ComboBoxForm ya hace onChange)
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

      <InputForm label="Dirección" name="address" classContainer="col-span-2" />

      <ComboBoxForm
        name="departmentId"
        label="Departamento"
        className="w-full!"
        searchable
        options={departmentOptions}
        isLoading={departmentsQuery.isLoading}
      />

      <ComboBoxForm
        name="provinceId"
        label="Provincia"
        className="w-full!"
        searchable
        disabled={!departmentId}
        options={provinceOptions}
        isLoading={provincesQuery.isLoading}
      />

      <ComboBoxForm
        name="districtId"
        label="Distrito"
        className="w-full!"
        searchable
        disabled={!departmentId || !provinceId}
        options={districtOptions}
        isLoading={districtsQuery.isLoading}
      />

      <InputForm label="Correo electrónico" name="email" />
      <InputForm label="Teléfono" name="phone" />
    </div>
  )
}
