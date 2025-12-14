import type { ColumnDef } from "@tanstack/react-table"
import { Edit2, Trash2 } from "lucide-react"

import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import type { VehicleResponse } from "@/app/vehicles/types/vehicle.type"

type VehiclesColumnsParams = {
  vehicleTypesMap: Record<number, string>
  onEdit: (vehicle: VehicleResponse) => void
  onDelete: (vehicle: VehicleResponse) => void   // 👈 aquí va el objeto
}

export function vehiclesColumns({
  vehicleTypesMap,
  onEdit,
  onDelete,
}: VehiclesColumnsParams): ColumnDef<VehicleResponse>[] {
  return [
    {
      accessorKey: "plate",
      header: "Placa",
    },
    {
      accessorKey: "vehicleTypeId",
      header: "Tipo",
      cell: ({ row }) =>
        vehicleTypesMap[row.original.vehicleTypeId ?? 0] ?? "-",
    },
    {
      accessorKey: "model",
      header: "Modelo",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      accessorKey: "fuelCapacityGal",
      header: "Capacidad de Tanque (L)",
      cell: ({ row }) => {
        const raw = row.original.fuelCapacityGal
        const num = Number(raw)
        if (!raw || isNaN(num) || num === 0) return "-"
        return num.toString()
      },
    },
    {
      accessorKey: "numberOfWheels",
      header: "Número de Ruedas",
      cell: ({ getValue }) => {
        const value = getValue<number | null>()
        return value ?? "-"
      },
    },
    {
      accessorKey: "mileage",
      header: "Kilometraje Inicial",
      cell: ({ getValue }) => {
        const value = getValue<number | null>()
        return value ?? "-"
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const vehicle = row.original

         return (
          <TooltipButton.Box>
            <TooltipButton
              tooltip="Editar"
              icon={Edit2}
              onClick={() => onEdit(vehicle)}
            />
            <TooltipButton
              tooltip="Eliminar"
              icon={Trash2}
              onClick={() => onDelete(vehicle)} // 👈 le pasamos el objeto
            />
          </TooltipButton.Box>
        )
      },
    },
  ]
}
