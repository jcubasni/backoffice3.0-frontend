import { useNavigate } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"

import { EmployedResponse } from "../types/employed.type"
import { Modals } from "../types/modals-name"

export const employedsColumns: ColumnDef<EmployedResponse>[] = [
  {
    id: "expander",
    size: 20,
    header: () => null,
    cell: () => null, // Empleados no tienen detalle expandible por ahora
  },

  {
    header: "Tipo documento",
    accessorKey: "documentType.name",
  },

  {
    header: "N° documento",
    accessorKey: "documentNumber",
  },

  {
    header: "Empleado",
    cell: ({ row }) => {
      const e = row.original
      return (
        <p className="mx-auto max-w-120 truncate text-ellipsis">
          {e.firstName?.toUpperCase()} {e.lastName?.toUpperCase()}
        </p>
      )
    },
  },

  // Si quieres mantener el switch igual que clientes, aquí un ejemplo.
  // Si no tienes un campo isActive, déjalo comentado o elimínalo.
  /*
  {
    header: "Activo",
    cell: ({ row }) => {
      const state = row.original.isActive
      return <Switch defaultChecked={state} />
    },
  },
  */

  {
    id: "actions",
    cell: ({ row }) => {
      const employed = row.original
      const navigate = useNavigate()
      const openModal = useModalStore.getState().openModal

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal(Modals.EDIT_EMPLOYED, employed)}
            icon={Edit}
          />
        </TooltipButton.Box>
      )
    },
  },
]
