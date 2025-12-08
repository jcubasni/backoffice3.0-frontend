import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { ProductResponse } from "../types/product.type"

export const productsColumns: ColumnDef<ProductResponse>[] = [
  {
    header: "ID",
    size: 50,
    cell: ({ row }) => {
      const id = row.original.productId
      return <span>#{id}</span>
    },
  },
  {
    header: "Código",
    size: 0,
    accessorKey: "productCode",
  },
  {
    header: "Nombre",
    accessorKey: "description",
  },
  {
    header: "Unidad",
    accessorKey: "measurementUnit",
  },
  {
    header: "Categoria",
    accessorFn: (row) => row.groupProduct?.id,
  },
  {
    header: "Stock",
    accessorKey: "stock",
  },
  {
    header: "Precio",
    accessorKey: "price",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: () => {
      return (
        <TooltipButton.Box>
          <TooltipButton tooltip="Editar" icon={Edit} />
          <TooltipButton tooltip="Eliminar" icon={Trash} />
        </TooltipButton.Box>
      )
    },
  },
]
