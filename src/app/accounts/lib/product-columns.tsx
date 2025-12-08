import { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import { ProductResponse } from "@/app/products/types/product.type"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"

interface ProductsColumnsProps {
  onDelete: (productId: number) => void
}

export const productsColumns = ({
  onDelete,
}: ProductsColumnsProps): ColumnDef<ProductResponse>[] => [
  {
    id: "index",
    size: 60,
    cell: ({ row }) => <span>#{row.index + 1}</span>,
  },
  {
    header: "Código producto",
    accessorKey: "productCode",
  },
  {
    header: "Producto",
    accessorKey: "description",
  },
  {
    id: "actions",
    size: 60,
    cell: ({ row }) => {
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Eliminar"
            onClick={() => onDelete(row.original.productId)}
            icon={Trash}
          />
        </TooltipButton.Box>
      )
    },
  },
]
