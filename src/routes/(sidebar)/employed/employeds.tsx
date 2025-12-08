import { createFileRoute } from "@tanstack/react-router"
import { BadgePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"

import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"

import { useGetEmployeds } from "@/app/employed/hooks/useEmployedsService"
import { employedsColumns } from "@/app/employed/lib/employeds-columns"
import { Modals } from "@/app/employed/types/modals-name"
// ❌ Aún no existe correctamente
import { ModalsEmployeds } from "@/app/employed/components/modals/modals-employed"

export const Route = createFileRoute("/(sidebar)/employed/employeds")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Empleados",
  },
})

function RouteComponent() {
  const [search, setSearch] = useDebounce("")
  const { isLoading, data } = useGetEmployeds()

  const filteredEmployeds = useSearch(data, search, [
    "firstName",
    "lastName",
    "documentNumber",
  ])

  const table = useDataTable({
    data: filteredEmployeds,
    columns: employedsColumns,
    isLoading,
  })

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <Input
            label="Buscar empleado"
            onChange={(e) => setSearch(e.target.value)}
            className="w-72! max-w-full"
          />
        </HeaderContent.Left>

        <HeaderContent.Right>
          <Button
            variant="outline"
            size="header"
            onClick={() =>
              useModalStore.getState().openModal(Modals.ADD_EMPLOYED)
            }
          >
            <BadgePlus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>
        </HeaderContent.Right>
      </HeaderContent>

      <DataTable table={table} />

      <ModalsEmployeds />

    </>
  )
}
