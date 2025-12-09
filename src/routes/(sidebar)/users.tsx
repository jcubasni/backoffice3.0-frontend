import { createFileRoute } from "@tanstack/react-router"
import { ModalsUsers } from "@users/components/modal/modals-users"
import { useGetUsers } from "@users/hooks/useUsersService"
import { usersColumns } from "@users/lib/users-columns"
import { BadgePlus, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useModalStore } from "@/shared/store/modal.store"

import { Input } from "@/shared/components/ui/input"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"

export const Route = createFileRoute("/(sidebar)/users")({
  component: RouteComponent,
  staticData: { headerTitle: "Usuarios" },
})

function RouteComponent() {
  const { openModal } = useModalStore()
  const { data, isLoading, isFetching } = useGetUsers()

  // --- Buscador ---
  const [search, setSearch] = useDebounce("")
  const filteredUsers = useSearch(data, search, [
    "employee.firstName",
    "username",
    "cardNumber",
    "password", // si quieres ignoramos después
  ])

  const table = useDataTable({
    data: filteredUsers,
    columns: usersColumns,
    isLoading: isLoading || isFetching,
  })

  return (
    <>
      <HeaderContent>

        {/* Buscador */}
        <HeaderContent.Left>
          <Input
            label="Buscar usuario"
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
            onClick={() => openModal("modal-add-user")}
          >
            <BadgePlus className="mr-2 h-4 w-4" />
            Nuevo
          </Button>

        </HeaderContent.Right>

      </HeaderContent>

      <DataTable table={table} />
      <ModalsUsers />
    </>
  )
}
