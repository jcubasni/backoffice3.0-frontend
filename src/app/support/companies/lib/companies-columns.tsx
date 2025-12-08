import { ColumnDef } from "@tanstack/react-table"
import { Edit, Eye, Trash } from "lucide-react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"

export const companiesColumns: ColumnDef<any>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id
      return <span className="w-full">#{id}</span>
    },
  },
  {
    header: "Host",
    cell: ({ row }) => {
      const host = row.original.host
      return <span className="w-full">{host}</span>
    },
  },
  {
    header: "RUC",
    cell: ({ row }) => {
      const ruc = row.original.ruc
      return <span className="w-full">{ruc}</span>
    },
  },
  {
    header: "Empresa",
    cell: ({ row }) => {
      const name = row.original.name
      return <span className="text-gray-800">{name}</span>
    },
  },
  {
    header: "Correo",
    cell: ({ row }) => {
      const email = row.original.email
      return <span className="text-gray-600">{email}</span>
    },
  },
  {
    header: "Baja",
    cell: ({ row }) => {
      const baja = row.original.isInactive
      const [checked, setChecked] = useState(baja)

      return (
        <div className="flex w-full justify-center">
          <Switch
            checked={checked}
            onCheckedChange={setChecked}
            className={
              checked ? "data-[state=checked]:bg-red-500" : "bg-gray-300"
            }
          />
        </div>
      )
    },
  },
  {
    header: "Bloquear Cuenta",
    cell: ({ row }) => {
      const blocked = row.original.isBlocked
      const [checked, setChecked] = useState(blocked)

      return (
        <div className="flex w-full justify-center">
          <Switch
            checked={checked}
            onCheckedChange={setChecked}
            className={
              checked ? "data-[state=checked]:bg-yellow-500" : "bg-gray-300"
            }
          />
        </div>
      )
    },
  },

  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const company = row.original
      const openModal = useModalStore.getState().openModal

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Ver estado"
            icon={Eye}
            onClick={() => openModal("modal-view-company-status", company)}
          />
          <TooltipButton
            tooltip="Editar"
            icon={Edit}
            onClick={() => openModal("modal-edit-companies", company)}
          />
          <TooltipButton
            tooltip="Eliminar"
            icon={Trash}
            onClick={() => openModal("modal-delete-companies", company.id)}
          />
        </TooltipButton.Box>
      )
    },
  },
]
