"use client"

import { useEffect, useMemo, useRef } from "react"
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
  useGetDistrictById,
  useGetDistricts,
  useGetProvinces,
} from "@/app/accounts/hooks/useUbigeoService"

import { applyPersonToForm } from "@/app/person/utils/apply-person-to-form"

export function ClientInfo() {
  const form = useFormContext<CreateClientSchema>()

  const documentTypes = useGetDocumentTypes()
  const departmentsQuery = useGetDepartments()

  const [documentType, documentNumber, departmentId, provinceId, districtId] = useWatch({
    control: form.control,
    name: ["documentType", "documentNumber", "departmentId", "provinceId", "districtId"],
  })

  const provincesQuery = useGetProvinces(departmentId)
  const districtsQuery = useGetDistricts(departmentId, provinceId)

  // ✅ cuando hay districtId, resolvemos dep/prov desde el backend
  const districtByIdQuery = useGetDistrictById(districtId || "")

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

  /**
   * ✅ Guard para que la cascada NO limpie valores cuando estamos “precargando”
   */
  const hydratingRef = useRef(false)

  /**
   * ✅ 1) Si districtId ya vino seteado (por búsqueda Persona),
   * resolvemos provinceId + departmentId para que se carguen opciones y se muestren combos.
   */
  useEffect(() => {
    const d = districtByIdQuery.data
    if (!d) return
    if (!districtId) return

    const nextDep = String(d.department?.id ?? "")
    const nextProv = String(d.province?.id ?? "")

    const currDep = form.getValues("departmentId") ?? ""
    const currProv = form.getValues("provinceId") ?? ""

    // Si ya está todo bien, no hagas nada
    if ((nextDep && currDep === nextDep) && (nextProv && currProv === nextProv)) return

    hydratingRef.current = true

    // Setear en orden para que carguen queries cascada
    if (nextDep && currDep !== nextDep) {
      form.setValue("departmentId", nextDep, { shouldDirty: true })
    }
    if (nextProv && currProv !== nextProv) {
      form.setValue("provinceId", nextProv, { shouldDirty: true })
    }
    // districtId ya está seteado (no lo tocamos)

    queueMicrotask(() => {
      hydratingRef.current = false
    })
  }, [districtByIdQuery.data, districtId, form])

  /**
   * ✅ 2) Reset cascada SOLO cuando el usuario cambia dept/prov
   * (si estamos hidratando, no limpiamos)
   */
  const prevDepRef = useRef<string | undefined>(undefined)
  const prevProvRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    // primera vuelta
    if (prevDepRef.current === undefined) {
      prevDepRef.current = departmentId
      return
    }

    if (hydratingRef.current) {
      prevDepRef.current = departmentId
      return
    }

    // si cambia departamento por usuario => limpiar prov/dist
    if (prevDepRef.current !== departmentId) {
      form.setValue("provinceId", "", { shouldDirty: true })
      form.setValue("districtId", "", { shouldDirty: true })
    }

    prevDepRef.current = departmentId
  }, [departmentId, form])

  useEffect(() => {
    if (prevProvRef.current === undefined) {
      prevProvRef.current = provinceId
      return
    }

    if (hydratingRef.current) {
      prevProvRef.current = provinceId
      return
    }

    // si cambia provincia por usuario => limpiar distrito
    if (prevProvRef.current !== provinceId) {
      form.setValue("districtId", "", { shouldDirty: true })
    }

    prevProvRef.current = provinceId
  }, [provinceId, form])

  const handleSearchWithValidation = async () => {
    return form.trigger(["documentType", "documentNumber"])
  }

  const { handleSearch, handleKeyDown } = useSearchDocument({
    documentType,
    documentNumber,
    shouldValidate: handleSearchWithValidation,
    onSuccess: (data: any) => {
      // ✅ Caso externo (lookup)
      if ("fiscalAddress" in data) {
        form.setValue("firstName", data.firstName)
        form.setValue("lastName", data.lastName ?? "")
        form.setValue("address", data.fiscalAddress ?? "")
        return
      }

      // ✅ Caso interno (BD Persona)
      // 👇 aquí llega districtId y el efecto de arriba completa dep/prov
      applyPersonToForm(form.setValue, data, {
        firstName: "firstName",
        lastName: "lastName",
        email: "email",
        phone: "phone",
        addressLine1: "address",
        districtId: "districtId",
      })
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
