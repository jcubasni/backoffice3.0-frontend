import { createFileRoute } from "@tanstack/react-router"
import { FilterDocument } from "@/app/collections/documents/components/filter-document"
import { ModalsDocuments } from "@/app/collections/documents/components/modals/modals-documents"
import { useGetDocuments } from "@/app/collections/documents/hooks/useDocumentsService"
import { documentsColumns } from "@/app/collections/documents/lib/documents-columns"
import { documentsSearchParams } from "@/app/collections/documents/schemas/document.schema"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"

export const Route = createFileRoute("/(sidebar)/collections/documents")({
  component: RouteComponent,
  validateSearch: documentsSearchParams,
  staticData: { headerTitle: "Por documento" },
})

function RouteComponent() {
  const { startDate, endDate, client, search } = Route.useSearch()
  const documents = useGetDocuments({
    clientId: client,
    params: {
      startDate,
      endDate,
    },
  })
  const table = useDataTable({
    data: documents.data,
    columns: documentsColumns,
    isLoading: false,
  })
  return (
    <>
      <FilterDocument params={{ startDate, endDate, client, search }} />
      <DataTable table={table} className="mt-4 flex-1" />
      <ModalsDocuments />
    </>
  )
}
