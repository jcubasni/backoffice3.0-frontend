import { type ColumnDef } from "@tanstack/react-table"
import Big from "big.js"
import { Trash } from "lucide-react"
import { QuantityCounter } from "@/shared/components/ui/quantity-counter"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatCurrency } from "@/shared/lib/number"
import { useProductStore } from "../store/product.store"
import { CreditNoteReasonEnum } from "../types/notes.enum"
import { NotesProduct } from "../types/notes.type"

export const billingNotesColumns = (
  reasonId?: number,
): ColumnDef<NotesProduct>[] => [
  {
    accessorKey: "productCode",
    header: "Codigo de producto",
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const updateProduct = useProductStore((state) => state.updateProduct)
      const isGlobalDiscountProduct =
        Number(reasonId) === CreditNoteReasonEnum.DESCUENTO_GLOBAL &&
        row.original.productCode === "9999"

      if (!isGlobalDiscountProduct) {
        return row.original.description
      }

      const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>,
      ) => {
        updateProduct(row.index, "description", e.target.value)
      }

      return (
        <input
          type="text"
          value={row.original.description}
          onChange={handleDescriptionChange}
          className="w-full rounded border px-2 py-1"
        />
      )
    },
  },
  {
    accessorKey: "measurementUnit",
    header: "U.M.",
  },
  {
    header: "Cantidad",
    cell: ({ row }) => {
      const { updateProduct, originalProducts } = useProductStore()
      const originalProduct = originalProducts.find(
        (p) => p.id === row.original.id,
      )
      const originalQuantity =
        originalProduct?.quantity || row.original.quantity

      if (Number(reasonId) !== CreditNoteReasonEnum.DEVOLUCION_POR_ITEM) {
        return originalQuantity
      }

      const currentQuantity = row.original.quantity

      const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity <= 0 || newQuantity > originalQuantity) return

        // Calculate and update subtotal and total using Big.js for precision
        const originalPrice = new Big(
          originalProduct?.unitPrice || row.original.unitPrice,
        )
        const quantity = new Big(newQuantity)

        // Remove IGV from price to get base imponible (BI)
        const baseImponible = originalPrice.div(1.18)

        // Calculate subtotal (BI * quantity)
        const newSubtotal = baseImponible.times(quantity)

        // Calculate IGV ((price - BI) * quantity)
        const igvPerUnit = originalPrice.minus(baseImponible)
        const totalIgv = igvPerUnit.times(quantity)

        // Total = subtotal + IGV
        const newTotal = newSubtotal.plus(totalIgv)

        // Update all fields in the store
        updateProduct(row.index, "quantity", newQuantity)
        updateProduct(row.index, "subtotal", Number(newSubtotal.toFixed(2)))
        updateProduct(row.index, "total", Number(newTotal.toFixed(2)))
      }

      return (
        <QuantityCounter
          value={currentQuantity}
          onChange={handleQuantityChange}
          min={1}
          max={originalQuantity}
          className="mx-auto w-fit"
        />
      )
    },
  },
  {
    accessorKey: "unitPrice",
    header: "Precio unitario",
    cell: ({ row }) => {
      const currentUnitPrice = row.original.unitPrice
      const { updateProduct, originalProducts } = useProductStore()
      const originalProduct = originalProducts.find(
        (p) => p.id === row.original.id,
      )
      const originalUnitPrice =
        originalProduct?.unitPrice || row.original.unitPrice

      const isDiscountByItem =
        Number(reasonId) === CreditNoteReasonEnum.DESCUENTO_POR_ITEM
      const isGlobalDiscountProduct =
        Number(reasonId) === CreditNoteReasonEnum.DESCUENTO_GLOBAL &&
        row.original.productCode === "9999"
      const isDescriptionCorrection =
        Number(reasonId) === CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION
      const isReprogramacionCuotas =
        Number(reasonId) === CreditNoteReasonEnum.REPROGRAMACION_CUOTAS

      const isEditableReason = isDiscountByItem || isGlobalDiscountProduct

      if (isReprogramacionCuotas) {
        return 0
      }

      if (isDescriptionCorrection) {
        return formatCurrency(currentUnitPrice)
      }

      if (!isEditableReason) {
        return originalUnitPrice
      }

      const handleUnitPriceChange = (newUnitPrice: number) => {
        // Para el producto de descuento global (9999), el máximo es el total de todos los productos originales
        const maxPrice = isGlobalDiscountProduct
          ? originalProducts.reduce((sum, product) => sum + product.total, 0)
          : originalUnitPrice

        if (newUnitPrice < 0 || newUnitPrice > maxPrice) return

        // Calculate and update subtotal and total using Big.js for precision
        const priceWithIgv = new Big(newUnitPrice)
        const currentQuantity = new Big(row.original.quantity)

        // Remove IGV from price to get base imponible (BI)
        const baseImponible = priceWithIgv.div(1.18)

        // Calculate subtotal (BI * quantity)
        const newSubtotal = baseImponible.times(currentQuantity)

        // Calculate IGV ((price - BI) * quantity)
        const igvPerUnit = priceWithIgv.minus(baseImponible)
        const totalIgv = igvPerUnit.times(currentQuantity)

        // Total = subtotal + IGV
        const newTotal = newSubtotal.plus(totalIgv)

        // Update all fields in the store
        updateProduct(row.index, "unitPrice", newUnitPrice)
        updateProduct(row.index, "subtotal", Number(newSubtotal.toFixed(2)))
        updateProduct(row.index, "total", Number(newTotal.toFixed(2)))
      }

      const maxPrice = isGlobalDiscountProduct
        ? originalProducts.reduce((sum, product) => sum + product.total, 0)
        : originalUnitPrice

      return (
        <QuantityCounter
          value={currentUnitPrice}
          onChange={handleUnitPriceChange}
          min={0}
          max={maxPrice}
          step={0.01}
          decimalPlaces={2}
          className="mx-auto w-fit"
        />
      )
    },
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => {
      const isDescriptionCorrection =
        Number(reasonId) === CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION
      const isReprogramacionCuotas =
        Number(reasonId) === CreditNoteReasonEnum.REPROGRAMACION_CUOTAS

      if (isDescriptionCorrection || isReprogramacionCuotas) {
        return 0
      }
      return row.original.subtotal
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const isDescriptionCorrection =
        Number(reasonId) === CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION
      const isReprogramacionCuotas =
        Number(reasonId) === CreditNoteReasonEnum.REPROGRAMACION_CUOTAS

      if (isDescriptionCorrection || isReprogramacionCuotas) {
        return 0
      }
      return row.original.total
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const { deleteProduct } = useProductStore()

      const handleDelete = () => {
        deleteProduct(row.index)
      }

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Eliminar"
            onClick={handleDelete}
            icon={Trash}
          />
        </TooltipButton.Box>
      )
    },
  },
]
