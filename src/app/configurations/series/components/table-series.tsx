import { BadgePlus, Columns3Cog } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Dropdown } from "@/shared/components/ui/dropdown"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"
import { getTableColumnOptions } from "../../shared/lib/table-column-options"
import { useGetSeries } from "../hooks/useSeriesService"
import { seriesColumns } from "../lib/series-columns"
import { ModalsSeries } from "./modal/modals-series"

export const TableSeries = () => {
  const [search, setSearch] = useDebounce("")
  const { data, isLoading, isFetching } = useGetSeries()

  const filteredSeries = useSearch(data, search, [
    "document.description",
    "seriesNumber",
    "correlativeStart",
    "local.localName",
  ])

  const table = useDataTable({
    data: filteredSeries,
    columns: seriesColumns,
    enableColumnVisibility: true,
    enableSorting: true,
    enableFilters: true,
    isLoading: isLoading || isFetching,
  })

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <Input
            label="Buscar serie"
            className="w-full sm:max-w-xs"
            onChange={(e) => setSearch(e.target.value)}
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Dropdown
            mainLabel={
              <p
                className={cn(
                  buttonVariants({ variant: "outline", size: "header" }),
                )}
              >
                <Columns3Cog />
                Columnas
              </p>
            }
            options={getTableColumnOptions(table)}
          />
          <Button
            variant="outline"
            size="header"
            onClick={() =>
              useModalStore.getState().openModal("modal-add-series")
            }
          >
            <BadgePlus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsSeries />
    </>
  )
}
