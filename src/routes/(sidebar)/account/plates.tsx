import {
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { z } from "zod"
import { ModalsPlate } from "@/app/accounts/components/modals/modal-plate/modals-plate"
import { useGetAccountByDocumentNumber } from "@/app/accounts/hooks/useClientsService"
import { useGetPlates } from "@/app/accounts/hooks/usePlatesServicec"
import { plateColumns } from "@/app/accounts/lib/plate-columns"
import { Modals } from "@/app/accounts/types/modals-name"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"

const platesSearchParams = z.object({
  doc: z.string().optional(),
  type: z.number().optional(),
})

export const Route = createFileRoute("/(sidebar)/account/plates")({
  component: RouteComponent,
  validateSearch: platesSearchParams,
  staticData: {
    headerTitle: "Placas",
  },
  beforeLoad: ({ search }) => {
    if (!search.doc || !search.type) {
      throw redirect({
        to: Routes.Clients,
      })
    }
  },
})

function RouteComponent() {
  const { doc, type } = Route.useSearch()
  const routerState = useRouterState({
    select: (select) => select.location.state,
  })
  const accountId = (routerState as { accountId?: string })?.accountId

  const account = useGetAccountByDocumentNumber(doc, type)
  const plates = useGetPlates(accountId)
  const table = useDataTable({
    data: plates.data,
    columns: plateColumns,
    isLoading: false,
  })

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left className="items-start md:flex-col">
          <p>
            <span>DOCUMENTO: </span>
            <span>{doc}</span>
          </p>
          <p>
            <span>CLIENTE: </span>
            <span>{account.data?.clientName}</span>
          </p>
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button
            variant="outline"
            size="header"
            onClick={() =>
              useModalStore.getState().openModal(Modals.ADD_PLATE, accountId)
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva placa
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} />
      <ModalsPlate />
    </>
  )
}
