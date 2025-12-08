import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSaleHelpers } from "@/app/sales/hooks/sale/useSale.helper"
import {
  useGetAntipatesByClientId,
  useGetDocumentByDocumentNumber,
} from "@/app/sales/hooks/sale/useSaleService"
import { fromDocumentToSalesProducts } from "@/app/sales/lib/sale/advance.util"
import { useClientUtilStore } from "@/app/sales/store/client-util.store"
import { useProductStore } from "@/app/sales/store/product.store"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ComboSearch } from "@/shared/components/ui/combo-search"
import { Radio } from "@/shared/components/ui/radio"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { dataToCombo } from "@/shared/lib/combo-box"

export const Advance = () => {
  const form = useFormContext()
  const saleDocumentType = useClientUtilStore((state) => state.documentTypeId)
  const clientId = useWatch({
    control: form.control,
    name: "clientInfo.id",
  })
  const advanceSearchTerm = useClientUtilStore(
    (state) => state.advanceSearchTerm,
  )
  const setField = useClientUtilStore((state) => state.setField)
  const { isInvoice } = useSaleHelpers()
  const [debouncedSearchTerm] = useDebounce(advanceSearchTerm, 500)
  const [advancePayment, setAdvancePayment] = useState("0")
  const [advanceDeduction, setAdvanceDeduction] = useState("0")
  const [selectedDocument, setSelectedDocument] = useState({
    documentNumber: "",
    id: "",
  })

  // Funciones para manejar cambios en los radio buttons
  const handleAdvancePayment = (value: string) => {
    setAdvancePayment(value)
    setAdvanceDeduction("0")
    setField("isAdvance", value === "1" || advanceDeduction === "1")
  }

  const handleDeduccionAnticipoChange = (value: string) => {
    setAdvanceDeduction(value)
    setAdvancePayment("0")
  }
  const advances = useGetAntipatesByClientId(clientId, debouncedSearchTerm)
  const advanceOptions = dataToCombo(advances.data, "id", "documentNumber")
  const document = useGetDocumentByDocumentNumber(
    selectedDocument.documentNumber,
  )

  const handleSearchAdvance = (searchTerm: string) => {
    setField("advanceSearchTerm", searchTerm)
  }

  const handleSelectAdvance = (item: string) => {
    if (!item) return

    const selected = advances.data?.find((doc) => doc.id === item)
    console.log("handleSelectAdvance - item:", item)
    console.log("handleSelectAdvance - selected:", selected)
    if (selected) {
      setSelectedDocument({
        documentNumber: selected.documentNumber,
        id: selected.id,
      })
    }
  }

  useEffect(() => {
    setAdvancePayment("0")
    setAdvanceDeduction("0")
    setField("advanceSearchTerm", "")
    setField("isAdvance", false)
    setSelectedDocument({ documentNumber: "", id: "" })
  }, [saleDocumentType, setField])

  useEffect(() => {
    console.log("useEffect - document:", {
      isSuccess: document.isSuccess,
      hasData: !!document.data,
      selectedDocument,
    })

    if (
      document.isSuccess &&
      document.data &&
      selectedDocument.documentNumber &&
      selectedDocument.id
    ) {
      console.log("useEffect - Adding advance product:", document.data)
      const { products, documentId } = fromDocumentToSalesProducts(
        document.data,
      )
      console.log(
        "useEffect - Products to add:",
        products,
        "documentId:",
        documentId,
      )
      const addAdvance = useProductStore.getState().addAdvance
      addAdvance(products, documentId)
    }
  }, [
    document.isSuccess,
    document.data,
    selectedDocument.documentNumber,
    selectedDocument.id,
  ])

  return (
    <AccordionItem value="advance" className="col-span-full">
      <AccordionTrigger>Anticipo</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance px-4">
        <Radio
          label="Pago anticipado"
          name="pago_anticipado"
          value={!isInvoice() ? "0" : advancePayment}
          options={[
            { label: "Sí", value: "1" },
            { label: "No", value: "0" },
          ]}
          orientation="horizontal"
          disabled={!isInvoice()}
          onValueChange={handleAdvancePayment}
          classContainer="w-fit"
        />
        <div className="flex w-full flex-wrap gap-x-8 gap-y-4">
          <Radio
            label="Deduccion del anticipo"
            name="deduccion_anticipo"
            value={!isInvoice() ? "0" : advanceDeduction}
            options={[
              { label: "Sí", value: "1" },
              { label: "No", value: "0" },
            ]}
            orientation="horizontal"
            disabled={!isInvoice()}
            onValueChange={handleDeduccionAnticipoChange}
            classContainer="w-fit"
          />
          <ComboSearch
            options={advanceOptions}
            disabled={!isInvoice() || advanceDeduction === "0" || !clientId}
            placeholder={
              clientId ? "Seleccione un documento" : "Selecciona un cliente"
            }
            onSearch={handleSearchAdvance}
            onSelect={handleSelectAdvance}
            isLoading={advances.isLoading}
            classContainer="w-56! flex-none"
            value={selectedDocument.id}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
