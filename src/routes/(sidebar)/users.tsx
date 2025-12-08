import { createFileRoute } from "@tanstack/react-router"
import { ModalsUsers } from "@users/components/modal/modals-users"
import { useGetUsers } from "@users/hooks/useUsersService"
import { usersColumns } from "@users/lib/users-columns"
import { BadgePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useModalStore } from "@/shared/store/modal.store"

export const Route = createFileRoute("/(sidebar)/users")({
  component: RouteComponent,
  staticData: { headerTitle: "Usuarios" },
})

function RouteComponent() {
  const { openModal } = useModalStore()
  const { data, isLoading, isFetching } = useGetUsers()

  const table = useDataTable({
    data,
    columns: usersColumns,
    isLoading: isLoading || isFetching,
  })

  return (
    <>
      <HeaderContent>
        <HeaderContent.Right>
          <Button size="header" onClick={() => openModal("modal-add-user")}>
            <BadgePlus />
            Nuevo
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsUsers />
    </>
  )
}
