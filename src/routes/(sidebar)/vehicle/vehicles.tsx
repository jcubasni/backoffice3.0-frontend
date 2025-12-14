import { useEffect, useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { BadgePlus, Columns3Cog, Download, FileText } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { Dropdown } from "@/shared/components/ui/dropdown"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"
import { getTableColumnOptions } from "@/app/configurations/shared/lib/table-column-options"
import { cn } from "@/lib/utils"

import {
  useGetVehicleTypes,
  useGetVehicles,
  useDeleteVehicle,
} from "@/app/vehicles/hooks/useVehiclesService"
import { vehiclesColumns } from "@/app/vehicles/lib/vehicles-columns"
import { defaultVehicleColumnsVisibility } from "@/app/vehicles/lib/default-vehicle-columns"
import type { VehicleResponse } from "@/app/vehicles/types/vehicle.type"

// IDs de los modales (objeto con strings)
import { ModalsVehicle } from "@/app/vehicles/types/modals-name"
// Componente que contiene TODOS los modales de vehículos
import { ModalsVehicleRoot } from "@/app/vehicles/components/modals/modals-vehicle"

const COLUMN_VISIBILITY_STORAGE_KEY = "vehicles-column-visibility"

// -------------------- RUTA --------------------
export const Route = createFileRoute("/(sidebar)/vehicle/vehicles")({
  component: RouteComponent,
  staticData: { headerTitle: "Vehículos" },
})

// -------------------- COMPONENTE --------------------
function RouteComponent() {
  const [search, setSearch] = useDebounce("")
  const [selectedType, setSelectedType] = useState<"all" | number>("all")

  const { data: vehicleTypes } = useGetVehicleTypes()
  const { data, isLoading } = useGetVehicles()
  const deleteVehicle = useDeleteVehicle()

  const openModal = useModalStore((state) => state.openModal)

  // ----- MAPA ID → NOMBRE DE TIPO -----
  const vehicleTypesMap = useMemo(() => {
    const map: Record<number, string> = {}
    vehicleTypes?.forEach((t) => {
      map[t.id] = t.name
    })
    return map
  }, [vehicleTypes])

  // ----- LISTA BASE -----
  const allVehicles: VehicleResponse[] = data?.rows ?? []

  // ----- FILTRO POR BÚSQUEDA -----
  const searchedVehicles = useSearch(allVehicles, search, [
    "plate",
    "brand",
    "model",
    "code",
  ])

  // ----- FILTRO POR TIPO -----
  const filteredVehicles = useMemo(
    () =>
      selectedType === "all"
        ? searchedVehicles
        : searchedVehicles.filter((v) => v.vehicleTypeId === selectedType),
    [searchedVehicles, selectedType],
  )

  // ----- COLUMNAS -----
const columns = useMemo(
  () =>
    vehiclesColumns({
      vehicleTypesMap,
      onEdit: (vehicle) => {
        openModal(ModalsVehicle.EDIT_VEHICLE, { vehicle })
      },
      onDelete: (vehicle) => {
        openModal(ModalsVehicle.DELETE_VEHICLE, { vehicle }) // Eliminar el objeto completo
      },
    }),
  [vehicleTypesMap, openModal],
)

  // ----- TABLA -----
  const table = useDataTable<VehicleResponse>({
    data: filteredVehicles,
    columns,
    enableColumnVisibility: true,
    enableFilters: true,
    enableSorting: true,
    isLoading,
  })

  const columnVisibility = table.getState().columnVisibility

  // ----- RESTAURAR VISIBILIDAD DE COLUMNAS -----
  useEffect(() => {
    const saved = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY)
    const visibility = saved
      ? JSON.parse(saved)
      : defaultVehicleColumnsVisibility

    const current = table.getState().columnVisibility
    const isDifferent =
      JSON.stringify(current) !== JSON.stringify(visibility)

    if (isDifferent) {
      table.setColumnVisibility(visibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ----- GUARDAR VISIBILIDAD DE COLUMNAS -----
  useEffect(() => {
    localStorage.setItem(
      COLUMN_VISIBILITY_STORAGE_KEY,
      JSON.stringify(columnVisibility),
    )
  }, [columnVisibility])

  // -------------------- UI --------------------
  return (
    <>
      <HeaderContent>
        {/* Buscador + filtro tipo */}
        <HeaderContent.Left>
          <div className="flex flex-col gap-2">
            <Input
              label="Buscar vehículo"
              placeholder="Placa, modelo, marca…"
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 max-w-full"
            />
          </div>

          <div className="ml-4 flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Filtrar por tipo de vehículo
            </span>
            <select
              className="h-9 rounded-md border bg-background px-3 text-sm"
              value={selectedType === "all" ? "all" : selectedType}
              onChange={(e) => {
                const value = e.target.value
                setSelectedType(value === "all" ? "all" : Number(value))
              }}
            >
              <option value="all">Todos los vehículos</option>
              {vehicleTypes?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </HeaderContent.Left>

        {/* Botones */}
        <HeaderContent.Right>
          {/* Columnas */}
          <Dropdown
            mainLabel={
              <p
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "header",
                  }),
                )}
              >
                <Columns3Cog className="mr-2 h-4 w-4" />
                Columnas
              </p>
            }
            options={getTableColumnOptions(table)}
          />

          {/* Exportar CSV (por implementar) */}
          <Button
            size="header"
            className="hover:bg-green-800 hover:text-white dark:hover:bg-green-900 dark:hover:text-white transition-colors"
            onClick={() => {
              // TODO: exportVehiclesToCSV(mapVehiclesToExport(filteredVehicles))
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          {/* Ver PDF (por implementar) */}
          <Button
            size="header"
            className="hover:bg-red-700 hover:text-white dark:hover:bg-red-900 dark:hover:text-white transition-colors"
            onClick={() => {
              // TODO: abrir modal "modal-preview-vehicles-pdf"
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver PDF
          </Button>

          {/* Nuevo */}
          <Button
            size="header"
            onClick={() => openModal(ModalsVehicle.ADD_VEHICLE)}
          >
            <BadgePlus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </HeaderContent.Right>
      </HeaderContent>

      {/* Tabla */}
      <DataTable table={table} />

      {/* Modales de vehículos */}
      <ModalsVehicleRoot />
    </>
  )
}
