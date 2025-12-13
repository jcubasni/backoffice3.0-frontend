"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { InputForm } from "@/shared/components/form/input-form"
import { cn } from "@/lib/utils"

import type { EditClientSchema } from "@accounts/schemas/edit-client.schema"
import type { ClientResponse } from "@accounts/types/client.type"

type ClientEditInfoProps = {
  client: ClientResponse
}

export function ClientEditInfo({ client }: ClientEditInfoProps) {
  // Solo para asegurar que estamos dentro de un RHF FormProvider
  useFormContext<EditClientSchema>()

  // Usamos el nombre del documento porque viene así del backend ("RUC")
  const isRuc =
    client.documentType?.name?.toUpperCase() === "RUC"

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      <h2 className="col-span-full text-xl font-bold text-foreground">
        Información Personal
      </h2>

      {/* 🔒 Tipo de documento (solo lectura) */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Tipo de documento</label>
        <Input
          value={client.documentType?.name ?? ""}
          disabled
          readOnly
        />
      </div>

      {/* 🔒 N° documento (solo lectura) */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">N° documento</label>
        <Input
          value={client.documentNumber}
          disabled
          readOnly
        />
      </div>

      {/* 👇 Campos editables (con React Hook Form) */}
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

      <InputForm
        label="Direccion"
        name="address"
        classContainer="col-span-2"
      />

      <InputForm label="Departamento" name="department" />
      <InputForm label="Provincia" name="province" />
      <InputForm label="Distrito" name="district" />
      <InputForm label="Correo electronico" name="email" />
      <InputForm label="Teléfono" name="phone" />
    </div>
  )
}
