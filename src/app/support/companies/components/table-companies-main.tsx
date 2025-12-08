import { BadgePlus, FileText } from "lucide-react"
import { lazy, useState } from "react"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { ModalLoader } from "@/shared/components/ui/modal-loader"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useModalStore } from "@/shared/store/modal.store"
import { useGetCompanies } from "../hooks/useCompaniesService"
import { companiesColumns } from "../lib/companies-columns"
import { exportCompaniesToExcel } from "../lib/excelTables/export-companies-to-excel"
import ModalDeleteCompanies from "./modal/modal-delete-companies"
import ModalEditCompanies from "./modal/modal-edit-companies"
import ModalViewCompanyStatus from "./modal/modal-view-company-status"

const ModalAddCompanies = lazy(() => import("./modal/modal-add-companies"))

export const TableCompaniesMain = () => {
  const [search, setSearch] = useState("")
  const { openModal } = useModalStore()
  const companies = useGetCompanies()

  const filteredCompanies = (companies.data ?? []).filter((company) => {
    const term = search.toLowerCase()
    return (
      company.name?.toLowerCase().includes(term) ||
      String(company.ruc).toLowerCase().includes(term)
    )
  })
  const table = useDataTable({
    data: filteredCompanies,
    columns: companiesColumns,
    isLoading: companies.isLoading,
  })

  const handleReport = () => {
    if (!filteredCompanies.length) {
      alert("No hay datos para exportar.")
      return
    }
    exportCompaniesToExcel(filteredCompanies)
  }
  return (
    <>
      <div className="mb-6">
        <HeaderContent>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-end">
              <Button
                variant="outline"
                size="header"
                onClick={() => openModal("modal-add-companies")}
              >
                <BadgePlus className="mr-2 h-4 w-4" />
                Nuevo
              </Button>

              <Input
                label="Buscar empresa"
                className="w-full sm:max-w-xs"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="header"
                className="w-full sm:w-auto"
                onClick={handleReport}
              >
                <FileText className="mr-2 h-4 w-4" />
                Reporte
              </Button>
            </div>
          </div>
        </HeaderContent>
      </div>

      <DataTable table={table} />
      <ModalLoader modalId="modal-add-companies">
        <ModalAddCompanies />
      </ModalLoader>
      <ModalLoader modalId="modal-edit-companies">
        <ModalEditCompanies />
      </ModalLoader>

      <ModalLoader modalId="modal-delete-companies">
        <ModalDeleteCompanies />
      </ModalLoader>

      <ModalLoader modalId="modal-view-company-status">
        <ModalViewCompanyStatus />
      </ModalLoader>
    </>
  )
}
