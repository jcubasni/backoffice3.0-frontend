import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { toCapitalize } from "@/shared/lib/words"
import { useModalStore } from "@/shared/store/modal.store"
import { StateAudit } from "@/shared/types/state.type"
import { GroupSerieResponse } from "../types/group-serie.type"

export const groupSerieColumns: ColumnDef<GroupSerieResponse>[] = [
  {
    header: "Tipo",
    accessorFn: (row) => toCapitalize(row.tipo.name),
    enableHiding: false,
  },
  {
    header: "Descripción",
    accessorKey: "description",
    enableHiding: false,
  },
  {
    header: "En uso",
    cell: ({ row }) => {
      const isUsed = row.original.isUsed
      return (
        <Badge variant={isUsed ? "green" : "red"}>
          {isUsed ? "En uso" : "Sin uso"}
        </Badge>
      )
    },
  },
  {
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.stateAudit
      const statusText = status === StateAudit.ACTIVE ? "Activo" : "Inactivo"
      const variant = status === StateAudit.ACTIVE ? "green" : "amber"
      return <Badge variant={variant}>{statusText}</Badge>
    },
  },
  {
    header: "Local",
    accessorKey: "local.localName",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original
      const openModal = useModalStore.getState().openModal

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal("modal-edit-group-serie", item)}
            icon={Edit}
          />
          <TooltipButton
            tooltip="Eliminar"
            onClick={() => openModal("modal-delete-group-serie", item)}
            icon={Trash}
          />
        </TooltipButton.Box>
      )
    },
  },
]
