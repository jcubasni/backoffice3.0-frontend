import type { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/shared/lib/date"
import { formatCurrency } from "@/shared/lib/number"
import type { Purchase } from "../types/purchase.type"

export const purchasesColumns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "purchaseNumber",
    header: "N° Compra",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("purchaseNumber")}</div>
    ),
  },
  {
    header: "RUC",
  },
  {
    accessorKey: "supplierName",
    header: "Proveedor",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.getValue("supplierName")}
      </div>
    ),
  },
  {
    accessorKey: "purchaseDate",
    header: "Fecha de pedido",
    cell: ({ row }) => {
      const date = row.getValue("purchaseDate") as string
      return <div>{formatDate(date)}</div>
    },
  },
  {
    accessorKey: "items",
    header: "Documento de origen",
    cell: ({ row }) => {
      const items = row.getValue("items") as Purchase["items"]
      return <div className="text-center">{items.length}</div>
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total") as number
      return (
        <div className="text-right font-medium">{formatCurrency(total)}</div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as Purchase["status"]
      const statusConfig = {
        pending: {
          label: "Pendiente",
          className: "bg-yellow-100 text-yellow-800",
        },
        completed: {
          label: "Completada",
          className: "bg-green-100 text-green-800",
        },
        cancelled: { label: "Cancelada", className: "bg-red-100 text-red-800" },
      }
      const config = statusConfig[status]
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 font-semibold text-xs ${config.className}`}
        >
          {config.label}
        </span>
      )
    },
  },
]
