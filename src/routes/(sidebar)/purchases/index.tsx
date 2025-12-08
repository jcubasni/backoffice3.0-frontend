import { createFileRoute } from "@tanstack/react-router"
import { Plus, Search } from "lucide-react"
import { purchasesColumns } from "@/app/purchases/lib/purchases-columns"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { Routes } from "@/shared/lib/routes"

export const Route = createFileRoute("/(sidebar)/purchases/")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Registro de proveedores",
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const table = useDataTable({
    data: [],
    columns: purchasesColumns,
    isLoading: false,
  })

  return (
    <>
      <HeaderContent>
        <HeaderContent.Left>
          <Input label="RUC" className="w-100" icon={Search} />
        </HeaderContent.Left>
        <HeaderContent.Right>
          <Button
            className=""
            onClick={() => navigate({ to: Routes.NewPurchase })}
          >
            <Plus /> Nueva Compra
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable
        table={table}
        className="mt-4 flex-1"
        placeholder="No hay compras"
      />
    </>
  )
}
