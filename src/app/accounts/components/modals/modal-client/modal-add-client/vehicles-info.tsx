"use client"

import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { useGetVehicleTypes } from "@/app/accounts/hooks/useVehicleService"
import { vehicleColumns } from "@/app/accounts/lib/vehicle-columns"
import {
  CreateClientSchema,
  VehicleSchema,
} from "@/app/accounts/schemas/create-client.schema"
import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { dataToComboAdvanced } from "@/shared/lib/combo-box"
import { useModalStore } from "@/shared/store/modal.store"

export function VehiclesInfo() {
  const { control } = useFormContext<CreateClientSchema>()
  const vehicles = useWatch({ control, name: "vehicles" }) || []
  const [vehicleFilterType, setVehicleFilterType] = useState("todos")
  const { openModal } = useModalStore()
  const { append } = useFieldArray({
    control,
    name: "vehicles",
  })

  const { data: vehicleTypes = [], isLoading: isLoadingVehicleTypes } =
    useGetVehicleTypes()

  const handleAddVehicle = () => {
    openModal(Modals.ADD_VEHICLE, {
      addVehicle: (data: VehicleSchema) => {
        append(data)
      },
    })
  }

  const filteredVehicles = useMemo(() => {
    if (vehicleFilterType === "todos") return vehicles
    return vehicles.filter(
      (vehicle) => vehicle.vehicleType === vehicleFilterType,
    )
  }, [vehicles, vehicleFilterType])

  const vehicleTypeOptions = useMemo(() => {
    const allOption = { label: "Todos los vehículos", value: "todos" }
    const typeOptions = dataToComboAdvanced(
      vehicleTypes,
      (type) => type.id.toString(),
      (type) => type.name,
    )
    return [allOption, ...typeOptions]
  }, [vehicleTypes])

  const table = useDataTable({
    columns: vehicleColumns,
    data: filteredVehicles,
    isLoading: false,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-foreground text-xl">
          Gestión de Vehículos
        </h2>
        <Button type="button" onClick={handleAddVehicle}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Vehículo
        </Button>
      </div>

      <ComboBox
        label="Filtrar por tipo de vehículo"
        placeholder="Selecciona un tipo"
        options={vehicleTypeOptions}
        value={vehicleFilterType}
        onSelect={(value) => {
          setVehicleFilterType(value)
        }}
        classContainer="max-w-xs"
        disabled={isLoadingVehicleTypes}
      />

      {filteredVehicles.length === 0 ? (
        <Card className="bg-sidebar/60 p-6">
          <p className="text-center text-foreground">
            No hay vehículos registrados. Agrega un nuevo vehículo.
          </p>
        </Card>
      ) : (
        <DataTable table={table} placeholder="No hay vehículos" />
      )}
    </div>
  )
}
