import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { companiesColumns } from "../lib/companies-columns"

export const TableCompanies = () => {
  const table = useDataTable({
    data: [],
    columns: companiesColumns,
    isLoading: false,
  })

  return <DataTable table={table} />
}
