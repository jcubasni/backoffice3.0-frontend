import { BadgePlus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useTableChanges } from "@/shared/hooks/useTableChanges"
import { useTableDataCopy } from "@/shared/hooks/useTableDataCopy"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetBankAccounts } from "../hooks/useBankAccountsService"
import { bankAccountsColumns } from "../lib/bank-accounts-columns"
import { ModalsBankAccounts } from "./modal/modals-bank-accounts"

export const TableBankAccounts = () => {
  const [search, setSearch] = useDebounce("")
  const { openModal } = useModalStore()
  const { data, isLoading, isFetching } = useGetBankAccounts()

  const { localData: documentsData, originalData: originalDocumentsData } =
    useTableDataCopy(data)

  const filteredAccounts = useSearch(documentsData, search, [
    "accountNumber",
    "holderName",
  ])

  const table = useDataTable({
    data: filteredAccounts,
    columns: bankAccountsColumns,
    isLoading: isLoading || isFetching,
  })

  const { getChanges } = useTableChanges(
    originalDocumentsData,
    (doc) => doc.id,
    (current, original) => current.stateAudit !== original.stateAudit,
    (doc) => ({ id: doc.id, stateAudit: doc.stateAudit }),
  )

  const handleSave = () => {
    const currentData = table.getRowModel().rows.map((row) => row.original)
    const changes = getChanges(currentData)
    console.log(changes)
  }

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <Input
            label="Buscar cuenta"
            className="w-full sm:max-w-xs"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button size="header" onClick={handleSave}>
            <Save className="w-full" />
            Guardar cambios
          </Button>
          <Button
            size="header"
            onClick={() => openModal("modal-add-bank-account")}
          >
            <BadgePlus className="w-full" />
            Nuevo
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsBankAccounts />
    </>
  )
}
