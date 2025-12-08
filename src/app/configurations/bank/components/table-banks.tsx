import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useTableChanges } from "@/shared/hooks/useTableChanges"
import { useTableDataCopy } from "@/shared/hooks/useTableDataCopy"
import { useGetBanks, useUpdateBankActive } from "../hooks/useBanksService"
import { banksColumns } from "../lib/banks-columns"

export const TableBanks = () => {
  const [search, setSearch] = useDebounce("")
  const updateBankActive = useUpdateBankActive()
  const { data, isLoading, isFetching } = useGetBanks()

  const { localData: banksData, originalData: originalBanksData } =
    useTableDataCopy(data)

  const filteredBanks = useSearch(banksData, search, ["code", "name"])

  const table = useDataTable({
    data: filteredBanks,
    columns: banksColumns,
    isLoading: isLoading || isFetching,
  })

  const { getChanges } = useTableChanges(
    originalBanksData,
    (bank) => bank.id,
    (current, original) => current.isActive !== original.isActive,
    (bank) => ({ id: bank.id, isActive: bank.isActive }),
  )

  const handleSaveChanges = () => {
    const currentData = table.getRowModel().rows.map((row) => row.original)
    const changes = getChanges(currentData)
    updateBankActive.mutate(changes)
  }

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <Input
            label="Buscar banco"
            className="w-full sm:max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button size="header" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
    </>
  )
}
