import { useNavigate } from "@tanstack/react-router"
import { format } from "date-fns"
import { useState } from "react"
import z from "zod"
import { Button } from "@/components/ui/button"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { ComboSearch } from "@/shared/components/ui/combo-search"
import { DatePicker } from "@/shared/components/ui/date-picker"
import { Input } from "@/shared/components/ui/input"
import { Routes } from "@/shared/lib/routes"
import { useClientHelper } from "../hooks/useClient.helper"
import { documentsSearchParams } from "../schemas/document.schema"

interface FilterDocumentProps {
  params: z.infer<typeof documentsSearchParams>
}

export const FilterDocument = ({ params }: FilterDocumentProps) => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    search: params?.search ?? "",
    client: params?.client ?? "",
    startDate: params?.startDate ?? "",
    endDate: params?.endDate ?? "",
  })

  const { clients, filterClients, handleSearch } = useClientHelper(
    filters.search,
  )

  const handleConsultar = () => {
    navigate({
      to: Routes.ForDocuments,
      search: {
        search: filters.search || undefined,
        client: filters.client || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      },
    })
  }

  return (
    <div className="flex w-full flex-wrap items-end justify-end gap-4">
      <div className="grid w-full grid-cols-4 gap-4">
        <Input label="Número de tarjeta" />
        <ComboSearch
          label="Cliente"
          placeholder="Buscar cliente..."
          options={clients}
          onSelect={(value) => {
            setFilters({ ...filters, client: value })
          }}
          onSearch={(value) => {
            handleSearch(value)
            setFilters({ ...filters, search: value })
          }}
          isLoading={filterClients.isLoading}
          search={filters.search}
          value={filters.client}
          classContainer="flex-1 col-span-2"
        />
      </div>
      <div className="grid w-full grid-cols-4 gap-4">
        <DatePicker
          label="Fecha desde"
          className="w-full!"
          defaultValue={filters.startDate}
          onSelect={(e) => {
            setFilters({ ...filters, startDate: format(e, "yyyy-MM-dd") })
          }}
        />
        <DatePicker
          label="Fecha hasta"
          className="w-full!"
          defaultValue={filters.endDate}
          onSelect={(e) => {
            setFilters({ ...filters, endDate: format(e, "yyyy-MM-dd") })
          }}
        />
        <ComboBox
          label="Estado"
          options={[
            { label: "Activo", value: "a" },
            { label: "Inactivo", value: "i" },
          ]}
          className="w-full!"
        />
        <Button
          size="header"
          className="ml-auto self-end"
          onClick={handleConsultar}
        >
          Consultar
        </Button>
      </div>
    </div>
  )
}
