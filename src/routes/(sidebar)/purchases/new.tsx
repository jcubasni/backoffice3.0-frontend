import { createFileRoute } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { addPurchaseColumns } from "@/app/purchases/lib/add-purchase-columns"
import { Button } from "@/components/ui/button"
import { DatePickerForm } from "@/shared/components/form/date-picker-form"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { Radio } from "@/shared/components/ui/radio"
import { useDataTable } from "@/shared/hooks/useDataTable"

export const Route = createFileRoute("/(sidebar)/purchases/new")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Nueva Compra",
  },
})

function RouteComponent() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const form = useForm()
  const handleSubmit = (data: any) => {
    console.log(data)
  }
  const table = useDataTable({
    data: [],
    columns: addPurchaseColumns,
    isLoading: false,
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        setIsSheetOpen(false)
      }
    }

    const handleFocusOutside = (event: FocusEvent) => {
      if (
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        setIsSheetOpen(false)
      }
    }

    if (isSheetOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("focusin", handleFocusOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("focusin", handleFocusOutside)
    }
  }, [isSheetOpen])

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col gap-6"
    >
      <section className="grid w-full grid-cols-3 gap-6">
        <Input label="Orden de compra" name="purchaseNumber" />
        <Input label="Documento de referencia" name="supplierId" />
        <DatePickerForm
          label="Fecha de compra"
          name="purchaseDate"
          className="w-full!"
        />
        <Input label="Proveedor" name="purchaseNumber" />
        <Radio
          label="Tipo de documento"
          orientation="horizontal"
          options={[
            { label: "Credito", value: "1" },
            { label: "Contado", value: "2" },
          ]}
          name="purchaseNumber"
        />
        <DatePickerForm
          label="Fecha de pedido"
          name="purchaseDate"
          className="w-full!"
        />
        <Button type="button" className="col-end-4">
          Importar XML
        </Button>
      </section>
      <section className="flex-1">
        <DataTable table={table} />
      </section>
      <section className="grid grid-cols-4 gap-4">
        <Input label="Base imponible" />
        <Input label="IGV" />
        <Input label="Total" />
        <Button
          type="button"
          className="w-full self-end"
          onClick={() => setIsSheetOpen(!isSheetOpen)}
        >
          Agregar datos adicionales
        </Button>

        <AnimatePresence>
          {isSheetOpen && (
            <motion.div
              ref={sheetRef}
              initial={{
                opacity: 0,
                scaleY: 0,
                originY: 1,
              }}
              animate={{
                opacity: 1,
                scaleY: 1,
              }}
              exit={{
                opacity: 0,
                scaleY: 0,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="absolute right-4 bottom-0 z-50 mb-6 w-full max-w-lg origin-bottom rounded-lg border bg-background p-6 shadow-xl"
            >
              <div className="mb-4 border-b pb-3">
                <h3 className="font-semibold text-lg">Datos Adicionales</h3>
              </div>

              <div className="flex max-h-[60vh] flex-col gap-4">
                <Input label="Rodaje" name="additionalData.paymentMethod" />
                <Input label="ISC" name="additionalData.paymentTerms" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </FormWrapper>
  )
}
