import { useCallback, useEffect, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useGetDocumentByDocumentNumber } from "@/app/sales/hooks/sale/useSaleService"
import { CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ButtonForm } from "@/shared/components/form/button-form"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { billingNotesColumns } from "../lib/new-billing-notes-columns"
import { fromDetailsToProducts } from "../lib/utils"
import { useSaleDocumentStore } from "../store/note.store"
import { useProductStore } from "../store/product.store"
import { CreditNoteReasonEnum } from "../types/notes.enum"

interface TableBillingNotesProps {
  isPending?: boolean
}

export function TableBillingNotes({
  isPending = false,
}: TableBillingNotesProps) {
  const form = useFormContext()
  const {
    products,
    originalProducts,
    totals,
    addProduct,
    resetProducts,
    restoreOriginalProducts,
  } = useProductStore()
  const { selectedSaleDocument, setProductChanges, resetForm } =
    useSaleDocumentStore()

  // Watch reason.id to conditionally show editable columns
  const reasonId = useWatch({ control: form.control, name: "reason.id" })

  // Use products directly from store
  const productsData = products

  const document = useGetDocumentByDocumentNumber(
    selectedSaleDocument.documentNumber,
  )

  useEffect(() => {
    if (document.isSuccess && document.data && selectedSaleDocument.id) {
      const salesProducts = fromDetailsToProducts(document.data.details)
      addProduct(salesProducts)
    }
  }, [document.isSuccess, document.data, selectedSaleDocument.id, addProduct])

  // Restore original products when reasonId changes
  useEffect(() => {
    if (reasonId && originalProducts.length > 0) {
      restoreOriginalProducts()
    }
  }, [reasonId, restoreOriginalProducts])

  const handleCancel = () => {
    form?.reset()
    resetProducts()
    resetForm()
  }

  // Track changes in discount and quantity
  const getChangesManually = useCallback(() => {
    // Para descuento global, comparar totales generales
    if (Number(reasonId) === CreditNoteReasonEnum.DESCUENTO_GLOBAL) {
      const originalTotal = originalProducts.reduce(
        (sum, product) => sum + product.total,
        0,
      )
      const currentTotal = totals.total

      // Si los totales son diferentes, significa que hay un descuento aplicado
      if (originalTotal !== currentTotal && productsData.length > 0) {
        // Retornar todos los productos actuales como cambios
        return productsData
      }

      return []
    }

    // Para otros casos, usar la lógica original
    const originalProductsMap = new Map(originalProducts.map((p) => [p.id, p]))

    return productsData.filter((product) => {
      const original = originalProductsMap.get(product.id)
      if (!original) return false

      return (
        product.unitPrice !== original.unitPrice ||
        product.quantity !== original.quantity
      )
    })
  }, [productsData, originalProducts, reasonId, totals.total])

  // Create columns with useMemo to force re-render when reasonId changes
  const columns = useMemo(() => billingNotesColumns(reasonId), [reasonId])

  const table = useDataTable({
    data: productsData,
    columns,
    isLoading: false,
  })

  useEffect(() => {
    if (productsData.length > 0) {
      const changes = getChangesManually()
      console.log("Changes detected:", changes)
      setProductChanges(changes)
    }
  }, [productsData, getChangesManually])

  return (
    <section className="mt-4 flex flex-1 flex-col">
      <DataTable key={`table-${reasonId}`} table={table} className="flex-1" />
      <Separator className="my-2" />
      <CardFooter className="grid grid-cols-5 gap-4">
        <div className="col-span-3 grid grid-cols-3 gap-4">
          <Input
            label="Op. de Gravada"
            value={
              Number(reasonId) ===
                CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION ||
              Number(reasonId) === CreditNoteReasonEnum.REPROGRAMACION_CUOTAS
                ? "0"
                : totals.subtotal.toString()
            }
            readOnly
            className="bg-muted"
          />
          <Input
            label="IGV"
            value={
              Number(reasonId) ===
                CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION ||
              Number(reasonId) === CreditNoteReasonEnum.REPROGRAMACION_CUOTAS
                ? "0"
                : totals.igv.toString()
            }
            readOnly
            className="bg-muted"
          />
          <Input
            label="Total"
            value={
              Number(reasonId) ===
                CreditNoteReasonEnum.CORRECCION_ERROR_DESCRIPCION ||
              Number(reasonId) === CreditNoteReasonEnum.REPROGRAMACION_CUOTAS
                ? "0"
                : totals.total.toString()
            }
            readOnly
            className="bg-muted"
          />
        </div>
        <div className="col-span-2 mt-auto grid grid-cols-2 gap-4">
          <ButtonForm type="button" text="Cancelar" onClick={handleCancel} />
          <ButtonForm
            type="submit"
            text="Generar"
            disabled={products.length === 0}
            isPending={isPending}
          />
        </div>
      </CardFooter>
    </section>
  )
}
