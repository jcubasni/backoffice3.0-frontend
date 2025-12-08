import { useEffect } from "react"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "@/shared/components/form/form-wrapper"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import {
  useHasOpen,
  useOpenCashRegister,
} from "../../hooks/sale/cash-register/useCashRegisterService"
import { useAddSale } from "../../hooks/sale/useAddSale"
import { productsColumns } from "../../lib/sale/products-columns"
import { SaleSchema } from "../../schemas/sale.schema"
import { useClientUtilStore } from "../../store/client-util.store"
import { useProductStore } from "../../store/product.store"
import { SaleDocumentType } from "../../types/sale"
import { SaleModals } from "./modals/sale-modals"
import { ClientInfo } from "./sections/client-info"
import { ExtraInfo } from "./sections/extra-info"
import { SearchProduct } from "./sections/search-product"
import { Totals } from "./sections/totals"

export const FormSale = () => {
  const hasOpen = useHasOpen()
  const openCash = useOpenCashRegister()
  const products = useProductStore((state) => state.products)
  const { form, handleSubmit, addSaleMutation } = useAddSale()
  const {
    selectedClientData,
    cashRegisterId,
    isVoucher,
    selectedPlate: plate,
    setField,
  } = useClientUtilStore(
    useShallow((state) => ({
      selectedClientData: state.selectedClientData,
      cashRegisterId: state.cashRegisterId,
      selectedPlate: state.selectedPlate,
      setField: state.setField,
      isVoucher: state.isVoucher,
    })),
  )

  const table = useDataTable({
    data: products,
    columns: productsColumns,
    showRows: 6,
  })

  const onSubmit = (data: SaleSchema) => {
    handleSubmit(data, products)
  }

  useEffect(() => {
    if (selectedClientData && isVoucher) {
      const documentTypeId =
        selectedClientData.documentTypeId === 4
          ? SaleDocumentType.FACTURA
          : SaleDocumentType.BOLETA

      setField("documentTypeId", documentTypeId)
      form.setValue("clientInfo", {
        ...selectedClientData,
        lastName: selectedClientData.lastName ?? null,
      })
      form.setValue("vehicleInfo", { plate: plate ?? "" })
    }
  }, [selectedClientData, isVoucher])

  useEffect(() => {
    const { data } = hasOpen
    if (!data) return
    if (data.hasOpen) {
      const newCashRegisterId = data.cashRegister?.id
      if (cashRegisterId !== newCashRegisterId) {
        setField("cashRegisterId", newCashRegisterId!)
      }
      return
    }
    toast.info("¿Desea abrir una caja para realizar ventas?", {
      duration: Infinity,
      action: (
        <Button
          onClick={() => openCash.mutate()}
          className="px-2 py-0"
          variant="outline"
        >
          Sí
        </Button>
      ),
    })
  }, [hasOpen.data])

  useEffect(() => {
    // Don't reset products when coming from voucher
    if (!isVoucher) {
      useProductStore.getState().resetProduct()
      useClientUtilStore.getState().resetClientUtil()
    }
  }, [])

  return (
    <div className="flex h-full flex-1 flex-col">
      <FormWrapper form={form} className="flex-1 gap-4" onSubmit={onSubmit}>
        <div className="flex grid-cols-2 flex-col gap-4 md:grid">
          <ClientInfo />
          <ExtraInfo />
          <SearchProduct />
        </div>
        <div className="flex-1">
          <DataTable table={table} showSelectPageSize={false} />
        </div>
        <Totals isPending={addSaleMutation.isPending} />
        <SaleModals />
      </FormWrapper>
    </div>
  )
}
