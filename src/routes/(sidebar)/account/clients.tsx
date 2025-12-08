import { createFileRoute } from "@tanstack/react-router"
import { BadgePlus } from "lucide-react"
import { ClientAccountDetail } from "@/app/accounts/components/client-account-detail"
import { ModalsClient } from "@/app/accounts/components/modals/modal-client/modals-client"
import { useGetClients } from "@/app/accounts/hooks/useClientsService"
import { clientsColumns } from "@/app/accounts/lib/clients-colums"
import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"

export const Route = createFileRoute("/(sidebar)/account/clients")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Clientes",
  },
})

function RouteComponent() {
  const [search, setSearch] = useDebounce("")
  const { isLoading, data } = useGetClients()

  const filteredClients = useSearch(data, search, [
    "firstName",
    "documentNumber",
    "lastName",
  ])

  const table = useDataTable({
    data: filteredClients,
    columns: clientsColumns,
    isLoading: isLoading,
    getRowCanExpand: () => true,
  })
  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <Input
            label="Buscar cliente"
            onChange={(e) => setSearch(e.target.value)}
            className="w-72! max-w-full"
          />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button
            variant="outline"
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
      <DataTable
        table={table}
        renderSubComponent={({ row }) => {
          const accounts = row.original.accounts
          if (!accounts || accounts.length === 0) return <div />

          return <ClientAccountDetail accounts={accounts} />
        }}
      />
      <ModalsClient />
    </>
  )
}
