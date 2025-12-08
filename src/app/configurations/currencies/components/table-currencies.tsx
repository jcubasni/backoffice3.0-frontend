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
import { useGetCurrencies } from "../hooks/useCurrenciesService"
import { columnsCurrencies } from "../lib/currencies-columns"
import { ModalsCurrencies } from "./modal/modals-currencies"

export function TableCurrencies() {
  const [search, setSearch] = useDebounce("")
  const { openModal } = useModalStore()
  const { data, isLoading, isFetching } = useGetCurrencies()

  const filteredCurrencies = useSearch(data, search, [
    "currencyCode",
    "currencyType",
    "simpleDescription",
    "completeDescription",
  ])

  const table = useDataTable({
    data: filteredCurrencies,
    columns: columnsCurrencies,
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
            label="Buscar moneda"
            className="w-full sm:max-w-xs"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
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
          <Button size="header" onClick={() => openModal("modal-add-currency")}>
            <BadgePlus className="mr-2 h-4 w-4" />
            Nueva
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsCurrencies />
    </>
  )
}
