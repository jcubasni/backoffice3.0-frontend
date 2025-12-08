import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"
import { Branch } from "../types/branches.type"

export const branchesColumns: ColumnDef<Branch>[] = [
  {
    header: "Nombre de referencia",
    accessorKey: "localCode",
  },
  {
    header: "Nombre",
    accessorKey: "localName",
  },

  {
    header: "Correo",
    accessorKey: "email",
  },
  {
    header: "Dirección",
    accessorKey: "address",
  },
  {
    header: "Teléfono",
    accessorKey: "telphoneNumber",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const item = row.original
      const openModal = useModalStore.getState().openModal

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal("modal-edit-branch", item)}
            icon={Edit}
          />
          <TooltipButton
            tooltip="Eliminar"
            onClick={() => openModal("modal-delete-branch", item.localCode)}
            icon={Trash}
          />
        </TooltipButton.Box>
      )
    },
  },
]
