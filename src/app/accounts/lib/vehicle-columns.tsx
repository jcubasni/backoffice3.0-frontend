import { ColumnDef } from "@tanstack/react-table"
import { Edit2, Trash2 } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"
import {
  CreateClientSchema,
  VehicleSchema,
} from "../schemas/create-client.schema"
import { Modals } from "../types/modals-name"

export const vehicleColumns: ColumnDef<VehicleSchema>[] = [
  {
    accessorKey: "licensePlate",
    header: "Placa",
  },
  {
    accessorKey: "vehicleType",
    header: "Tipo",
  },
  {
    header: "Tarjeta",
    accessorKey: "cardNumber",
  },
  {
    header: "Modelo",
    accessorFn: (row) => row.model || "-",
  },
  {
    header: "Cap. Tanque",
    accessorFn: (row) => row.tankCapacity || "-",
  },
  {
    header: "Ruedas",
    accessorFn: (row) => row.numberOfWheels || "-",
  },
  {
    accessorKey: "initialKilometrage",
    header: "Km Inicial",
    accessorFn: (row) => row.initialKilometrage || "-",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const form = useFormContext<CreateClientSchema>()
      const index = row.index // <-- el index REAL del fieldArray
      const { remove, update } = useFieldArray({
        control: form.control,
        name: "vehicles",
      })

      const handleEdit = () => {
        useModalStore.getState().openModal(Modals.ADD_VEHICLE, {
          editVehicle: (idx: number, data: VehicleSchema) => {
            update(idx, data)
          },
          index: index,
          vehicleData: row.original,
        })
      }

      return (
        <TooltipButton.Box>
          <TooltipButton tooltip="Editar" icon={Edit2} onClick={handleEdit} />
          <TooltipButton
            tooltip="Eliminar"
            icon={Trash2}
            onClick={() => remove(index)}
          />
        </TooltipButton.Box>
      )
    },
  },
]
