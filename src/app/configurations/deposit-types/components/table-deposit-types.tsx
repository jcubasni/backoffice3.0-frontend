import { BadgePlus } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetDepositTypes } from "../hooks/useDepositTypesService"
import { depositTypesColumns } from "../lib/deposit-types-columns"
import { ModalsDepositTypes } from "./modal/modals-deposit-types"

export function TableDepositTypes() {
  const [search, setSearch] = useState("")
  const { openModal } = useModalStore()
  const { data, isLoading, isFetching } = useGetDepositTypes()

  const filteredDepositTypes = useMemo(() => {
    if (!data) return []
    const term = search.toLowerCase()
    return data.filter(
      (item) =>
        item.codeDepositType?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term),
    )
  }, [data, search])

  const table = useDataTable({
    data: filteredDepositTypes,
    columns: depositTypesColumns,
    isLoading: isLoading || isFetching,
  })

  return (
    <>
      <HeaderContent>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            label="Buscar tipo de depósito"
            className="w-full sm:max-w-xs"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <Button
            size="header"
            onClick={() => openModal("modal-add-deposit-type")}
          >
            <BadgePlus />
            Nuevo
          </Button>
        </div>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsDepositTypes />
    </>
  )
}
