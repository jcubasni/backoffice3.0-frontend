import { BadgePlus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { ComboBox } from "@/shared/components/ui/combo-box"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { dataToCombo } from "@/shared/lib/combo-box"
import useBranchStore from "@/shared/store/branch.store"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetGroupSeries } from "../hooks/useGroupSerieService"
import { groupSerieColumns } from "../lib/group-serie-columns"
import { ModalsGroupSerie } from "./modal/modals-group-serie"

export const TableGroupSeries = () => {
  const branches = useBranchStore((state) => state.branch)
  const [selectedBranch, setSelectedBranch] = useState(branches[0].localId)
  const { data, isLoading } = useGetGroupSeries(selectedBranch)
  const table = useDataTable({
    data,
    columns: groupSerieColumns,
    enableColumnVisibility: true,
    enableSorting: true,
    enableFilters: true,
    isLoading,
  })

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <ComboBox
            options={dataToCombo(branches, "localId", "localName")}
            label="Local"
            defaultValue={branches[0].localId}
            onSelect={setSelectedBranch}
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button
            variant="outline"
            size="header"
            onClick={() =>
              useModalStore.getState().openModal("modal-add-group-serie")
            }
          >
            <BadgePlus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsGroupSerie />
    </>
  )
}
