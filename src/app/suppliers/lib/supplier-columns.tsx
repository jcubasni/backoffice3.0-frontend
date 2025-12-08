import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"

import { SupplierResponse } from "../types/supplier.type"
import { useModalStore } from "@/shared/store/modal.store"
import { Modals } from "../types/modals-name"

export const suppliersColumns: ColumnDef<SupplierResponse>[] = [
  {
    header: "Tipo documento",
    accessorKey: "documentType.name",
  },
  {
    header: "N° documento",
    accessorKey: "documentNumber",
  },
  {
    header: "Razón Social",
    cell: ({ row }) => (
      <p className="mx-auto max-w-120 truncate text-ellipsis">
        {row.original.businessName.toUpperCase()}
      </p>
    ),
  },
  {
    header: "Contacto",
    accessorKey: "contactName",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return <Switch defaultChecked={isActive} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original
      const openModal = useModalStore.getState().openModal

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            icon={Edit}
            onClick={() => openModal(Modals.EDIT_SUPPLIER, supplier)}
          />

          <TooltipButton
            tooltip="Eliminar"
            icon={Trash2}
            onClick={() => openModal(Modals.DELETE_SUPPLIER, supplier)}
          />
        </TooltipButton.Box>
      )
    },
  },
]
