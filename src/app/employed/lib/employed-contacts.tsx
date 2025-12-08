"use client"

import { InputForm } from "@/shared/components/form/input-form"
import { useFormContext } from "react-hook-form"
import { CreateEmployedSchema } from "@/app/employed/schemas/create-employed.schema"

export function EmployedContacts() {
  const form = useFormContext<CreateEmployedSchema>()

  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
      <h2 className="col-span-full font-bold text-foreground text-xl">
        Contactos
      </h2>

      {/* Teléfono */}
      <InputForm
        label="Teléfono"
        name="phoneNumber"
        classContainer="col-span-1"
      />

      {/* Correo */}
      <InputForm
        label="Correo electrónico"
        name="email"
        classContainer="col-span-1"
      />

      {/* Dirección */}
      <InputForm
        label="Dirección"
        name="address"
        classContainer="col-span-full"
      />

      {/* Contacto alternativo */}
      <InputForm
        label="Contacto alternativo"
        name="alternativeContact"
        classContainer="col-span-1"
      />

      {/* Notas */}
      <InputForm
        label="Notas"
        name="notes"
        classContainer="col-span-full"
      />
    </div>
  )
}
