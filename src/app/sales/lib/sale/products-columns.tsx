import { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import { GroupProductType, SalesProduct } from "@/app/sales/types/product.type"
import { Input } from "@/shared/components/ui/input"
import { QuantityCounter } from "@/shared/components/ui/quantity-counter"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatCurrency } from "@/shared/lib/number"
import { useSaleHelpers } from "../../hooks/sale/useSale.helper"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import { idAdvanceProduct } from "../../types/sale"

export const productsColumns: ColumnDef<SalesProduct>[] = [
  {
    header: "Código",
    accessorKey: "productId",
  },
  {
    header: "Producto",
    accessorKey: "description",
  },
  {
    header: "U.M",
    cell: ({ row }) => row.original.measurementUnit ?? "",
  },
  {
    header: "Detalle",
    accessorKey: "stock",
    // cell: ({ row }) => row.original.detalle || "-",
  },
  {
    header: "Cantidad",
    accessorKey: "quantity",
    cell: ({ row }) => {
      const { productId, isDocument, detractionType } = row.original
      const value = row.getValue<number>("quantity") || 1
      const voucher = useClientUtilStore((state) => state.isVoucher)
      const isAdvance = productId === idAdvanceProduct && isDocument
      const isVoucher = voucher && isDocument
      const hasDetractionData = !!detractionType

      if (isAdvance || isVoucher || hasDetractionData) {
        return value
      }

      const handleQuantityChange = (newQuantity: number) => {
        useProductStore
          .getState()
          .updateProductQuantity(row.original.productId, newQuantity)
      }

      return (
        <QuantityCounter
          value={value}
          onChange={handleQuantityChange}
          min={0.00001}
          disabled={row.original.isDocument}
          // max={parseFloat(row.original.stock)}
        />
      )
    },
  },
  {
    header: "Precio unitario",
    accessorKey: "price",
    cell: ({ row }) => {
      const { price, productId, detractionType } = row.original
      const hasDetractionData = !!detractionType

      if (hasDetractionData) {
        const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newPrice = parseFloat(e.target.value) || 0
          useProductStore.getState().updateProductPrice(productId, newPrice)
        }

        return (
          <Input
            type="number"
            value={parseFloat(price || "0")}
            onChange={handlePriceChange}
            className="mx-auto w-20 rounded border px-2 py-1 text-center text-sm"
            step="0.01"
            min="0"
          />
        )
      }

      return formatCurrency(price ?? "0")
    },
  },
  // {
  //   header: "Descuento",
  //   accessorKey: "descuento",
  //   // cell: ({ row }) =>
  //   //   row.original.descuento
  //   //     ? `S/ ${row.original.descuento.toFixed(2)}`
  //   //     : "S/ 0.00",
  // },
  {
    header: "Subtotal",
    accessorKey: "subtotal",
    cell: ({ row }) => {
      return formatCurrency(row.original.subtotal ?? 0)
    },
  },
  {
    header: "Total",
    accessorKey: "total",
    cell: ({ row }) => {
      const { total, productId, groupProduct } = row.original
      const { isAdvance } = useSaleHelpers()
      const isCombustible = groupProduct?.id === GroupProductType.COMBUSTIBLE

      if (isCombustible || isAdvance()) {
        const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newTotal = parseFloat(e.target.value) || 0
          useProductStore.getState().updateProductTotal(productId, newTotal)
        }

        return (
          <Input
            type="number"
            variant={"ghost"}
            value={parseFloat(total?.toString() || "0")}
            onChange={handleTotalChange}
            className="mx-auto w-20 py-0.5 text-center text-sm"
            step="0.01"
            min="0"
          />
        )
      }

      return formatCurrency(total ?? 0)
    },
  },
  {
    id: "actions",
    size: 0,
    cell: ({ row }) => {
      const handleDelete = () => {
        useProductStore.getState().deleteProduct(row.original.productId)
      }
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Eliminar"
            icon={Trash}
            onClick={handleDelete}
          />
        </TooltipButton.Box>
      )
    },
  },
]
