import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useTableChanges } from "@/shared/hooks/useTableChanges"
import { useTableDataCopy } from "@/shared/hooks/useTableDataCopy"
import {
  useGetDocuments,
  useUpdateDocumentState,
} from "../hooks/useDocumentsService"
import { documentsColumns } from "../lib/documents-columns"

export default function TableDocuments() {
  const [search, setSearch] = useDebounce("")
  const updateDocumentState = useUpdateDocumentState()
  const { data, isLoading, isFetching } = useGetDocuments()

  const { localData: documentsData, originalData: originalDocumentsData } =
    useTableDataCopy(data)

  const filteredDocuments = useSearch(documentsData, search, [
    "documentCode",
    "description",
    "name",
  ])

  const table = useDataTable({
    data: filteredDocuments,
    columns: documentsColumns,
    isLoading: isLoading || isFetching,
  })

  const { getChanges } = useTableChanges(
    originalDocumentsData,
    (doc) => doc.id,
    (current, original) => current.stateAudit !== original.stateAudit,
    (doc) => ({ id: doc.id, stateAudit: doc.stateAudit }),
  )

  const handleSaveChanges = () => {
    const currentData = table.getRowModel().rows.map((row) => row.original)
    const changes = getChanges(currentData)
    updateDocumentState.mutate(changes)
  }

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <Input
            label="Buscar documento"
            classContainer="w-80 max-w-full"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
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
