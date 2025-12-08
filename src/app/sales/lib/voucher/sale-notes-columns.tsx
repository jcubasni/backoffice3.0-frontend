import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { SaleNotesResponse } from "../../types/voucher.type"

export const saleNotesColumns: ColumnDef<SaleNotesResponse>[] = [
  {
    id: "select",
    size: 60,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        classContainer="mx-auto"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "documentNumber",
    header: "Documento",
  },
  {
    accessorKey: "vehiclePlate",
    header: "Placa",
  },
  {
    accessorKey: "product.foreignName",
    header: "Nombre",
  },
  {
    accessorKey: "product.unitPrice",
    header: "Precio",
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
  },
  {
    accessorFn: (row) => format(new Date(row.createdAt), "dd/MM/yyyy HH:mm"),
    header: "Fecha",
  },
]
