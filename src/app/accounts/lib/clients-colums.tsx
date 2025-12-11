import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"

import type { ClientResponse } from "../types/client.type"
import { Modals } from "../types/modals-name"

export const clientsColumns: ColumnDef<ClientResponse>[] = [
  // 🔽 EXPANDER (NO OCULTABLE)
  {
    id: "expander",
    size: 20,
    header: " ",
    enableHiding: false,  
    cell: ({ row }) => {
      const hasAccounts = row.original.accounts?.length > 0

      return hasAccounts && row.getCanExpand() ? (
        <Button
          variant="ghost"
          onClick={() => row.toggleExpanded()}
          className="h-6 w-6 p-0"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              row.getIsExpanded() && "rotate-180",
            )}
          />
        </Button>
      ) : null
    },
  },

  // 📌 Tipo documento
  {
    id: "documentType",
    accessorFn: (row) => row.documentType?.name ?? "",
    header: ({ column }) => (
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1 font-semibold"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        <span>Tipo documento</span>
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => row.original.documentType?.name ?? "-",
    enableSorting: true,
    enableHiding: false,
  },

  // 📌 N° documento
  {
    id: "documentNumber",
    accessorKey: "documentNumber",
    header: ({ column }) => (
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1 font-semibold"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        <span>N° documento</span>
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    enableSorting: true,
    enableHiding: false,
  },

  // 📌 Cliente
  {
    id: "clientName",
    accessorFn: (row) =>
      `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
    header: ({ column }) => (
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1 font-semibold"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        <span>Cliente</span>
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => (
      <p className="mx-auto max-w-120 truncate text-ellipsis">
        {row.original.firstName?.toUpperCase()}{" "}
        {row.original.lastName?.toUpperCase()}
      </p>
    ),
    enableSorting: true,
    enableHiding: false,
  },

  // 📌 Teléfono
  {
    id: "phoneNumber",
    header: "Teléfono",
    accessorKey: "phoneNumber",
  },

  // 📌 Correo
  {
    id: "email",
    header: "Correo",
    accessorKey: "email",
  },

  // 📌 Dirección
  {
    id: "address",
    header: "Dirección",
    accessorKey: "address",
    enableHiding: true,
  },

  {
    id: "department",
    header: "Departamento",
    accessorKey: "department",
    enableHiding: true,
  },

  {
    id: "province",
    header: "Provincia",
    accessorKey: "province",
    enableHiding: true,
  },

  {
    id: "district",
    header: "Distrito",
    accessorKey: "district",
    enableHiding: true,
  },

  // 📌 Estado cuenta
  {
    id: "accountStatus",
    header: "Bloquear cuenta",
    enableHiding: false,
    cell: ({ row }) => {
      if (!row.original.accounts?.length) return null

      const state = row.original.accounts[0]?.status
      return <Switch defaultChecked={state} />
    },
  },

  // 📌 Acciones
  {
    id: "actions",
    header: "Acciones",
    enableHiding: false,
    cell: ({ row }) => {
      const openModal = useModalStore.getState().openModal
      const client = row.original

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal(Modals.EDIT_CLIENT, client)}
            icon={Edit}
          />
        </TooltipButton.Box>
      )
    },
  },
]
