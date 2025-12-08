import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"

export const TableCompaniesConfig = () => {
  const [search, setSearch] = useState("")

  return (
    <div className="w-full space-y-6">
      {/* Buscador */}
      <div className="flex max-w-md gap-2">
        <Input
          placeholder="Filtrar por nombre o RUC"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline">Buscar</Button>
      </div>

      {/* Dos columnas: Izquierda (Certificado), Derecha (Logo + Contraseña) */}
      <div className="flex flex-col gap-4 lg:w-[95rem] lg:flex-row ">
        {/* Izquierda */}
        <div className="w-full space-y-4 rounded-lg border p-4 lg:w-1/2">
          <h2 className="font-bold text-sm">Certificado OSE / PSE</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Usuario OSE / PSE:" />
            <Input label="Contraseña:" type="password" />
          </div>
          <Button variant="outline">Guardar</Button>

          <div className="pt-2">
            <Input label="Subir certificado (.pfx)" type="file" />
          </div>

          <div className="flex w-full flex-col gap-4 ">
            <Input label="Usuario Secundario SUNAT:" />
            <Input label="Contraseña SUNAT:" type="password" />
          </div>
          <Button variant="outline">Guardar</Button>
        </div>

        {/* Derecha */}
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          {/* Logo / Imagen */}
          <div className="space-y-4 rounded-lg border p-4">
            <h2 className="font-bold text-sm">Logo / Imagen de fondo</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Logo:" type="file" />
              <Input label="Imagen de fondo:" type="file" />
            </div>
          </div>

          {/* Cambio de contraseña */}
          <div className="space-y-4 rounded-lg border p-4">
            <h2 className="font-bold text-sm">Cambio de contraseña</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Correo:" />
              <Input label="Contraseña nueva:" type="password" />
            </div>
            <Button variant="outline">Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
