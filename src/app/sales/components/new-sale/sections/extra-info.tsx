import { useExtraInfoHelpers } from "@/app/sales/hooks/sale/useExtraInfo.helper"
import { useSaleHelpers } from "@/app/sales/hooks/sale/useSale.helper"
import { useClientUtilStore } from "@/app/sales/store/client-util.store"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ComboBoxForm } from "@/shared/components/form/combo-box-form"
import { TextareaForm } from "@/shared/components/form/textarea-form"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { dataToCombo } from "@/shared/lib/combo-box"
import { Advance } from "./advance"
import { Dates } from "./dates"

export const ExtraInfo = () => {
  // const selectedClientData = useClientUtilStore(
  //   (state) => state.selectedClientData,
  // )
  const paymentType = useClientUtilStore((state) => state.paymentType)

  const {
    isFreeTransfer,
    isVoucher,
    isAdvance,
    selectedSaleType,
    series,
    seriesIsLoading,
    paymentTypes,
    paymentTypesIsLoading,
    saleTypes,
    saleTypesIsLoading,
    currencies,
    currenciesIsLoading,
    isSaleNote,
    handleFreeTransferChange,
    // handleSaleType,
    handlePaymentTypeSelect,
  } = useExtraInfoHelpers()
  const { isCreditInvoice } = useSaleHelpers()

  // const percentageValue = selectedClientData?.has_retention
  //   ? RetentionPercentage
  //   : 0

  return (
    <div className="flex-1">
      <Accordion type="single" collapsible className="col-span-full w-full">
        <section className="grid h-full items-end gap-2 gap-x-4 md:grid-cols-2 2xl:grid-cols-3">
          <ComboBoxForm
            label="Serie"
            className="w-full!"
            name="serieId"
            options={dataToCombo(series, "id", "seriesNumber")}
            isLoading={seriesIsLoading}
          />
          <Dates />
          <ComboBox
            label="Termino de pago"
            className="w-full!"
            options={dataToCombo(paymentTypes, "id", "name")}
            value={paymentType}
            isLoading={paymentTypesIsLoading}
            onSelect={handlePaymentTypeSelect}
          />
          <ComboBox
            label="Tipo de venta"
            className="w-full!"
            name="saleType"
            options={dataToCombo(saleTypes, "id", "name")}
            value={selectedSaleType}
            isLoading={saleTypesIsLoading}
          />
          {/* <Input label="Porcentaje" value={percentageValue} readOnly /> */}
          <ComboBoxForm
            label="Tipo de moneda"
            className="w-full!"
            name="currencyId"
            options={dataToCombo(currencies, "idCurrency", "simpleDescription")}
            defaultValue={currencies?.[0].idCurrency}
            isLoading={currenciesIsLoading}
          />
          {/* <InputForm name="exchange" label="Tipo de cambio" readOnly /> */}
          <Checkbox
            label="Transferencia Gratuita"
            name="isFree"
            classContainer="h-10"
            onCheckedChange={handleFreeTransferChange}
            checked={isFreeTransfer}
            disabled={isSaleNote || isVoucher || isAdvance || isCreditInvoice()}
          />
          <Advance />

          <AccordionItem value="observations" className="col-span-full">
            <AccordionTrigger>Observaciones</AccordionTrigger>
            <AccordionContent>
              <TextareaForm name="notes" classContainer="row-span-2" />
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>
    </div>
  )
}
