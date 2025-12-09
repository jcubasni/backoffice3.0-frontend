import { createFileRoute } from "@tanstack/react-router"
import {
  BadgePlus,
  Download,
  FileText,
  Columns3Cog,
} from "lucide-react"

import { ClientAccountDetail } from "@/app/accounts/components/client-account-detail"
import { ModalsClient } from "@/app/accounts/components/modals/modal-client/modals-client"
import { useGetClients } from "@/app/accounts/hooks/useClientsService"
import { clientsColumns } from "@/app/accounts/lib/clients-colums"
import { defaultClientColumnsVisibility } from "@/app/accounts/lib/default-client-columns"
import { Modals } from "@/app/accounts/types/modals-name"

import { Button, buttonVariants } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"

import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"

import {
  exportClientsToCSV,
  mapClientsToExport,
} from "@/app/accounts/utils/clients-export"
import { generateClientsPDF } from "@/app/accounts/utils/clients-export-pdf"

import { Dropdown } from "@/shared/components/ui/dropdown"
import { getTableColumnOptions } from "@/app/configurations/shared/lib/table-column-options"

import { cn } from "@/lib/utils"
import { useEffect } from "react"

// -------------------- RUTA --------------------
export const Route = createFileRoute("/(sidebar)/account/clients")({
  component: RouteComponent,
  staticData: { headerTitle: "Clientes" },
})

// -------------------- COMPONENTE --------------------
function RouteComponent() {
  const [search, setSearch] = useDebounce("")
  const { isLoading, data } = useGetClients()

  // ---------------- FILTRO DE BÚSQUEDA ----------------
  const filteredClients = useSearch(data, search, [
    "firstName",
    "lastName",
    "documentNumber",
    "email",
    "address",
    "department",
    "province",
    "district",
    "phoneNumber",
  ])

  // --------------- CREAR TABLA -------------------------
  const table = useDataTable({
    data: filteredClients,
    columns: clientsColumns,
    enableColumnVisibility: true,
    enableFilters: true,
    getRowCanExpand: () => true,
    isLoading,
  })

  // --------------- RESTAURAR COLUMNAS GUARDADAS ----------------
  useEffect(() => {
    const saved = localStorage.getItem("clients-column-visibility")
    const visibility = saved
      ? JSON.parse(saved)
      : defaultClientColumnsVisibility

    const current = table.getState().columnVisibility
    const isDifferent =
      JSON.stringify(current) !== JSON.stringify(visibility)

    if (isDifferent) {
      table.setColumnVisibility(visibility)
    }
  }, [])

  // --------------- GUARDAR CAMBIOS DE COLUMNAS ----------------
  useEffect(() => {
    const visibility = table.getState().columnVisibility
    localStorage.setItem(
      "clients-column-visibility",
      JSON.stringify(visibility),
    )
  }, [table.getState().columnVisibility])

  // -------------------- UI --------------------
  return (
    <>
      <HeaderContent>

        {/* Buscador */}
        <HeaderContent.Left>
          <Input
            label="Buscar cliente"
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 max-w-full"
          />
        </HeaderContent.Left>

        {/* Botones */}
        <HeaderContent.Right>

          {/* Columnas */}
          <Dropdown
            mainLabel={
              <p
                className={cn(
                  buttonVariants({ variant: "outline", size: "header" })
                )}
              >
                <Columns3Cog className="mr-2 h-4 w-4" />
                Columnas
              </p>
            }
            options={getTableColumnOptions(table)}
          />

          {/* Exportar CSV */}
          <Button
            size="header"
            className="
              hover:bg-green-800 hover:text-white
              dark:hover:bg-green-900 dark:hover:text-white
              transition-colors
            "
            onClick={() =>
              exportClientsToCSV(mapClientsToExport(filteredClients))
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>

          {/* Ver PDF — versión clásica completa */}
          <Button
            size="header"
            className="
              hover:bg-red-700 hover:text-white
              dark:hover:bg-red-900 dark:hover:text-white
              transition-colors
            "
            onClick={() =>
              generateClientsPDF(mapClientsToExport(filteredClients))
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            Ver PDF
          </Button>

          {/* Nuevo */}
          <Button
            size="header"
            onClick={() =>
              useModalStore.getState().openModal(Modals.ADD_CLIENT)
            }
          >
            <BadgePlus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>

        </HeaderContent.Right>
      </HeaderContent>

      {/* Tabla */}
      <DataTable
        table={table}
        renderSubComponent={({ row }) => {
          const accounts = row.original.accounts
          if (!accounts || accounts.length === 0) return <div />
          return <ClientAccountDetail accounts={accounts} />
        }}
      />

      {/* Modales */}
      <ModalsClient />
    </>
  )
}
