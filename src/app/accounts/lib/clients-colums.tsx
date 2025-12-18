import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { useModalStore } from "@/shared/store/modal.store"

import type { ClientResponse } from "../types/client.type"
import { Modals } from "../types/modals-name"

/**
 * 🧩 Helper: obtiene la dirección principal (addresses[0] o la que tenga isPrimary)
 */
const getPrimaryAddress = (client: ClientResponse) => {
  if (!client.addresses || client.addresses.length === 0) return undefined
  return client.addresses.find((addr) => addr.isPrimary) ?? client.addresses[0]
}

/**
 * ✅ Helper: si viene string -> string
 * si viene objeto -> obj.name
 */
const toUbigeoName = (value: unknown) => {
  if (!value) return ""
  if (typeof value === "string") return value
  if (typeof value === "object" && "name" in (value as any)) {
    return String((value as any).name ?? "")
  }
  return ""
}

export const clientsColumns: ColumnDef<ClientResponse>[] = [
  {
    id: "expander",
    size: 20,
    header: " ",
    enableHiding: false,
    cell: ({ row }) => {
      const hasAccounts = (row.original as any).accounts?.length > 0

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

  {
    id: "documentType",
    accessorFn: (row) => row.documentType?.name ?? "",
    header: ({ column }) => (
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1 font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Tipo documento</span>
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => row.original.documentType?.name ?? "-",
    enableSorting: true,
    enableHiding: false,
  },

  {
    id: "documentNumber",
    accessorKey: "documentNumber",
    header: ({ column }) => (
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1 font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>N° documento</span>
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    enableSorting: true,
    enableHiding: false,
  },

  {
    id: "clientName",
    accessorFn: (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
    header: ({ column }) => (
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1 font-semibold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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

  {
    id: "phoneNumber",
    header: "Teléfono",
    accessorKey: "phoneNumber",
  },

  {
    id: "email",
    header: "Correo",
    accessorKey: "email",
  },

  {
    id: "address",
    header: "Dirección",
    accessorFn: (row) => {
      const primary = getPrimaryAddress(row)
      return primary?.addressLine1 ?? ""
    },
    enableHiding: true,
  },

  // 📌 Departamento

{
  id: "department",
  header: "Departamento",
  accessorFn: (row) => toUbigeoName(getPrimaryAddress(row)?.department),
  enableHiding: true,
},
{
  id: "province",
  header: "Provincia",
  accessorFn: (row) => toUbigeoName(getPrimaryAddress(row)?.province),
  enableHiding: true,
},
{
  id: "district",
  header: "Distrito",
  accessorFn: (row) => toUbigeoName(getPrimaryAddress(row)?.district),
  enableHiding: true,
},


  // {
  //   id: "accountStatus",
  //   header: "Bloquear cuenta",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const accounts = (row.original as any).accounts as
  //       | { status: boolean }[]
  //       | undefined

  //     if (!accounts?.length) return null

  //     const state = accounts[0]?.status
  //     return <Switch defaultChecked={state} />
  //   },
  // },

  {
    id: "actions",
    header: "Acciones",
    enableHiding: false,
    cell: ({ row }) => {
      const openModal = useModalStore.getState().openModal
      const client = row.original
      const primary = getPrimaryAddress(client)

     const clientForModal = {
  ...client,
  address: primary?.addressLine1 ?? "",
  departmentId: primary?.department?.id ?? "",
  provinceId: primary?.province?.id ?? "",
  districtId: primary?.district?.id ?? "",
}



      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal(Modals.EDIT_CLIENT, clientForModal)}
            icon={Edit}
          />
        </TooltipButton.Box>
      )
    },
  },
]
