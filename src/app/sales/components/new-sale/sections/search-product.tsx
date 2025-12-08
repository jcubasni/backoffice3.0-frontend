import { useProductSearch } from "@sales/hooks/sale/product/useProductSearch"
import { PlusCircle, Ticket } from "lucide-react"
import { useSaleHelpers } from "@/app/sales/hooks/sale/useSale.helper"
import { Button } from "@/components/ui/button"
import { ComboSearch } from "@/shared/components/ui/combo-search"

export const SearchProduct = () => {
  const {
    selectedProduct,
    isLoading,
    options,
    handleSelectProduct,
    handleAddProduct,
    redirectVoucher,
    selectedPlate,
  } = useProductSearch()
  const { isSaleNote } = useSaleHelpers()

  return (
    <div className="col-span-2 grid h-fit grid-cols-2 items-end gap-4 md:grid-cols-5">
      <ComboSearch
        classContainer="col-span-full md:col-span-3"
        className="w-full!"
        placeholder={
          isSaleNote() && !selectedPlate
            ? "Seleccione una placa"
            : "Seleccione producto"
        }
        options={options}
        onSelect={handleSelectProduct}
        value={selectedProduct}
        isLoading={isLoading}
        disabled={isSaleNote() && !selectedPlate}
      />
      <Button type="button" onClick={handleAddProduct}>
        <PlusCircle />
        Agregar
      </Button>
      <Button type="button" onClick={redirectVoucher} disabled={isSaleNote()}>
        <Ticket />
        Vale
      </Button>
    </div>
  )
}
