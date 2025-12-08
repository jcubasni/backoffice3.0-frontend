import { BadgePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetBranches } from "../hooks/useBranchesService"
import { branchesColumns } from "../lib/branches-columns"
import { ModalsBranches } from "./modals-branches"

export const TableBranches = () => {
  const [search, setSearch] = useDebounce("")
  const { openModal } = useModalStore()
  const { data, isLoading, isFetching } = useGetBranches()

  const filteredBranches = useSearch(data, search, [
    "localCode",
    "localName",
    "name",
  ])

  const table = useDataTable({
    data: filteredBranches,
    columns: branchesColumns,
    isLoading: isLoading || isFetching,
  })

  return (
    <>
      <HeaderContent>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            label="Buscar sede"
            className="w-full sm:max-w-xs"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <Button size="header" onClick={() => openModal("modal-add-branch")}>
            <BadgePlus />
            Nuevo
          </Button>
        </div>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsBranches />
    </>
  )
}
