"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFormContext, useWatch } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { InputForm } from "@/shared/components/form/input-form"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { dataToCombo } from "@/shared/lib/combo-box"
import { cn } from "@/lib/utils"

import type { EditClientSchema } from "@accounts/schemas/edit-client.schema"
import type { ClientResponse } from "@accounts/types/client.type"

import {
  useGetDepartments,
  useGetProvinces,
  useGetDistricts,
  useGetDistrictById,
} from "@/app/accounts/hooks/useUbigeoService"

const getPrimaryAddress = (client: ClientResponse) => {
  if (!client.addresses || client.addresses.length === 0) return undefined
  return client.addresses.find((a) => a.isPrimary) ?? client.addresses[0]
}

type ClientEditInfoProps = {
  client: ClientResponse
}

export function ClientEditInfo({ client }: ClientEditInfoProps) {
  const form = useFormContext<EditClientSchema>()
  const isRuc = client.documentType?.name?.toUpperCase() === "RUC"

  const primary = useMemo(() => getPrimaryAddress(client), [client])

  const initialDistrictId =
    (client as any)?.districtId ?? (primary as any)?.district?.id ?? ""

  const [departmentId, provinceId, districtId] = useWatch({
    control: form.control,
    name: ["departmentId", "provinceId", "districtId"],
  })

  const districtByIdQuery = useGetDistrictById(
    (districtId as string) || initialDistrictId,
  )

  const departmentsQuery = useGetDepartments()
  const provincesQuery = useGetProvinces(departmentId)
  const districtsQuery = useGetDistricts(departmentId, provinceId)

  const hydratingRef = useRef(false)
  const didInitRef = useRef(false)

  // ✅ para detectar cambios reales del usuario
  const prevDepartmentRef = useRef<string>("")
  const prevProvinceRef = useRef<string>("")

  // ✅ 1) Precargar departmentId + provinceId + districtId desde districtId inicial
  useEffect(() => {
    if (didInitRef.current) return
    if (!initialDistrictId) {
      didInitRef.current = true
      return
    }

    const resolved = districtByIdQuery.data
    if (!resolved) return

    const depId = resolved.department?.id ?? ""
    const provId = resolved.province?.id ?? ""
    const distId = resolved.id ?? ""

    const currentDep = form.getValues("departmentId") ?? ""
    const currentProv = form.getValues("provinceId") ?? ""
    const currentDist = form.getValues("districtId") ?? ""

    const needsSet =
      !currentDep || !currentProv || !currentDist || currentDist !== distId

    if (!needsSet) {
      didInitRef.current = true
      return
    }

    hydratingRef.current = true

    form.setValue("departmentId", depId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    })
    form.setValue("provinceId", provId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    })
    form.setValue("districtId", distId, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    })

    // setear prevs para que NO dispare resets por primera vez
    prevDepartmentRef.current = depId
    prevProvinceRef.current = provId

    queueMicrotask(() => {
      hydratingRef.current = false
      didInitRef.current = true
    })
  }, [districtByIdQuery.data, form, initialDistrictId])

  // ✅ 2) Reset cascada SOLO si el usuario cambió realmente el departamento
  useEffect(() => {
    const prev = prevDepartmentRef.current
    const curr = (departmentId as string) ?? ""

    // primera vez o hidratando -> no tocar
    if (hydratingRef.current) {
      prevDepartmentRef.current = curr
      return
    }
    if (!prev) {
      prevDepartmentRef.current = curr
      return
    }

    if (prev !== curr) {
      form.setValue("provinceId", "", { shouldDirty: true, shouldValidate: true })
      form.setValue("districtId", "", { shouldDirty: true, shouldValidate: true })
    }

    prevDepartmentRef.current = curr
  }, [departmentId, form])

  // ✅ 3) Reset cascada SOLO si el usuario cambió realmente la provincia
  useEffect(() => {
    const prev = prevProvinceRef.current
    const curr = (provinceId as string) ?? ""

    if (hydratingRef.current) {
      prevProvinceRef.current = curr
      return
    }
    if (!prev) {
      prevProvinceRef.current = curr
      return
    }

    if (prev !== curr) {
      form.setValue("districtId", "", { shouldDirty: true, shouldValidate: true })
    }

    prevProvinceRef.current = curr
  }, [provinceId, form])

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      <h2 className="col-span-full text-xl font-bold text-foreground">
        Información Personal
      </h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Tipo de documento</label>
        <Input value={client.documentType?.name ?? ""} disabled readOnly />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">N° documento</label>
        <Input value={client.documentNumber} disabled readOnly />
      </div>

      <InputForm
        label={isRuc ? "Razón social" : "Nombres"}
        classContainer={cn(isRuc ? "col-span-full" : "col-span-1")}
        name="firstName"
      />

      <InputForm
        label="Apellidos"
        name="lastName"
        classContainer={cn(isRuc ? "hidden" : "col-span-1")}
      />

      <InputForm label="Direccion" name="address" classContainer="col-span-2" />

      <ComboBoxForm
        name="departmentId"
        label="Departamento"
        className="w-full!"
        searchable
        options={dataToCombo(departmentsQuery.data ?? [], "id", "name")}
      />

      <ComboBoxForm
        name="provinceId"
        label="Provincia"
        className="w-full!"
        searchable
        disabled={!departmentId}
        options={dataToCombo(provincesQuery.data ?? [], "id", "name")}
      />

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
