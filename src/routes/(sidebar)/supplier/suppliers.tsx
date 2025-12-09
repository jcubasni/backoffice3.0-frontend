import { createFileRoute } from "@tanstack/react-router"
import { BadgePlus, Download, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"

import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"

import { useGetSuppliers } from "@/app/suppliers/hooks/useSuppliersService"
import { suppliersColumns } from "@/app/suppliers/lib/supplier-columns"
import { Modals } from "@/app/suppliers/types/modals-name"
import { ModalsSupplier } from "@/app/suppliers/components/modal/modals-supplier"

export const Route = createFileRoute("/(sidebar)/supplier/suppliers")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Proveedores",
  },
})

function RouteComponent() {
  const [search, setSearch] = useDebounce("")
  const { data, isLoading } = useGetSuppliers()

  // Filtrar datos
  const filteredSuppliers = useSearch(data, search, [
    "businessName",
    "documentNumber",
    "contactName",
  ])

  // Tabla
  const table = useDataTable({
    data: filteredSuppliers,
    columns: suppliersColumns,
    isLoading,
  })

  return (
    <>
      <HeaderContent>

        {/* Búsqueda */}
        <HeaderContent.Left>
          <Input
            label="Buscar proveedor"
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 max-w-full"
          />
        </HeaderContent.Left>

        {/* Botones */}
        <HeaderContent.Right>

          {/* Exportar */}
          <Button
            size="header"
            className="
              hover:bg-green-800 hover:text-white 
              dark:hover:bg-green-900 dark:hover:text-white 
              transition-colors
            "
            onClick={() => {}}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          {/* Ver PDF */}
          <Button
            size="header"
            className="
              hover:bg-red-700 hover:text-white 
              dark:hover:bg-red-900 dark:hover:text-white 
              transition-colors
            "
            onClick={() => {}}
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver PDF
          </Button>

          {/* Nuevo */}
          <Button
            size="header"
            onClick={() =>
              useModalStore.getState().openModal(Modals.ADD_SUPPLIER)
            }
          >
            <BadgePlus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>

        </HeaderContent.Right>
      </HeaderContent>

      {/* Tabla */}
      <DataTable table={table} />

      {/* Modales */}
      <ModalsSupplier />
    </>
  )
}
