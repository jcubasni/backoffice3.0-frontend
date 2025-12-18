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

/**
 * 🧩 Helper: obtiene la dirección principal (addresses[0] o isPrimary)
 */
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

  // ✅ districtId inicial: primero del payload del modal, si no, desde addresses[].district.id
  const primary = useMemo(() => getPrimaryAddress(client), [client])

  const initialDistrictId =
    (client as any)?.districtId ??
    (primary as any)?.district?.id ??
    ""

  // ✅ Watch de cascada
  const [departmentId, provinceId, districtId] = useWatch({
    control: form.control,
    name: ["departmentId", "provinceId", "districtId"],
  })

  // ✅ Query para resolver dep/prov desde districtId
  const districtByIdQuery = useGetDistrictById(
    (districtId as string) || initialDistrictId,
  )

  // ✅ Queries Ubigeo
  const departmentsQuery = useGetDepartments()
  const provincesQuery = useGetProvinces(departmentId)
  const districtsQuery = useGetDistricts(departmentId, provinceId)

  /**
   * 🧠 Hydration guard:
   * Cuando precargamos dep/prov/district desde el endpoint,
   * NO queremos que la cascada los limpie.
   */
  const hydratingRef = useRef(false)
  const didInitRef = useRef(false)

  // ✅ 1) Precargar departmentId + provinceId + districtId desde GET /ubigeo/districts/:id
  useEffect(() => {
    if (didInitRef.current) return

    // si no hay districtId para resolver, no hacemos nada
    if (!initialDistrictId) {
      didInitRef.current = true
      return
    }

    const resolved = districtByIdQuery.data
    if (!resolved) return

    const depId = resolved.department?.id ?? ""
    const provId = resolved.province?.id ?? ""
    const distId = resolved.id ?? ""

    // Si ya están seteados, no sobreescribimos
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

    // liberamos el guard en el siguiente tick
    queueMicrotask(() => {
      hydratingRef.current = false
      didInitRef.current = true
    })
  }, [districtByIdQuery.data, form, initialDistrictId])

  // ✅ 2) Reset cascada (solo cuando cambia por el USUARIO, no por precarga)
  useEffect(() => {
    if (!departmentId) return
    if (hydratingRef.current) return

    // si el usuario cambió departamento, limpiamos provincia/distrito
    form.setValue("provinceId", "", { shouldDirty: true })
    form.setValue("districtId", "", { shouldDirty: true })
  }, [departmentId, form])

  useEffect(() => {
    if (!provinceId) return
    if (hydratingRef.current) return

    // si el usuario cambió provincia, limpiamos distrito
    form.setValue("districtId", "", { shouldDirty: true })
  }, [provinceId, form])

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      <h2 className="col-span-full text-xl font-bold text-foreground">
        Información Personal
      </h2>

      {/* 🔒 Tipo de documento (solo lectura) */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Tipo de documento</label>
        <Input value={client.documentType?.name ?? ""} disabled readOnly />
      </div>

      {/* 🔒 N° documento (solo lectura) */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">N° documento</label>
        <Input value={client.documentNumber} disabled readOnly />
      </div>

      {/* 👇 Campos editables */}
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
