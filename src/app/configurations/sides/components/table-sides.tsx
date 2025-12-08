import { Save } from "lucide-react"
import { useState } from "react"
import { useGetFuelProducts } from "@/app/products/hooks/useProductsService"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { dataToCombo } from "@/shared/lib/combo-box"
import useBranchStore from "@/shared/store/branch.store"
import { useGetSides } from "../hooks/useSidesService"
import { sidesColumns } from "../lib/sides-columns"
import { ModalsSides } from "./modal/modals-sides"

export const TableSides = () => {
  const { branch, selectedBranch } = useBranchStore()
  const [local, setLocal] = useState(selectedBranch?.localId)
  const { data, isLoading, isFetching } = useGetSides(local)
  const { data: fuelProducts } = useGetFuelProducts()

  const table = useDataTable({
    data,
    columns: sidesColumns(fuelProducts ?? []),
    enableSorting: true,
    enableFilters: true,
    isLoading: isLoading || isFetching,
  })

  const handleSave = () => {}

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <ComboBox
            options={dataToCombo(branch, "localId", "localName")}
            label="Sede"
            defaultValue={selectedBranch?.localId}
            onSelect={(value) => setLocal(value)}
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button size="header" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsSides />
    </>
  )
}
