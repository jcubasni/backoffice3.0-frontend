import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"
import { User } from "../types/users.type"

export const usersColumns: ColumnDef<User>[] = [
  {
    header: "Nombre",
    accessorKey: "employee.firstName",
  },
  {
    header: "Nombre de usuario",
    accessorKey: "username",
  },
  {
    header: "Nº Tarjeta",
    accessorKey: "cardNumber",
  },
  {
    header: "Sedes Asignadas",
    accessorKey: "UserLocals",
    cell: ({ row }) => {
      const userLocals = row.original.UserLocals || []

      if (userLocals.length === 0) {
        return (
          <Badge variant={"secondary"} className="text-xs">
            Sin sedes asignadas
          </Badge>
        )
      }

      const activeLocals = userLocals.filter(
        (userLocal) => userLocal.stateAudit === "A",
      )

      if (activeLocals.length === 0) {
        return (
          <Badge variant={"secondary"} className="text-xs">
            Sin sedes activas
          </Badge>
        )
      }

      return (
        <div className="flex flex-wrap justify-center gap-1">
          {activeLocals.map((userLocal, index) => {
            return (
              <Badge key={index} className="text-xs">
                {userLocal.local.localName}
              </Badge>
            )
          })}
        </div>
      )
    },
  },
  {
    id: "actions",
    size: 0,
    cell: ({ row }) => {
      const item = row.original
      const openModal = useModalStore.getState().openModal

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            icon={Edit}
            onClick={() => openModal("modal-edit-user", item)}
          />
          <TooltipButton
            tooltip="Eliminar"
            icon={Trash}
            onClick={() => openModal("modal-delete-user", item.id)}
          />
        </TooltipButton.Box>
      )
    },
  },
]
