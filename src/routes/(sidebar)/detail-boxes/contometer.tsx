import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft, Edit } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import {
  useEditContometers,
  useGetContometersByReport,
} from "@/app/contometer/hooks/useContometerService"
import { contometerColumns } from "@/app/contometer/lib/contometer-columns"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useTableChanges } from "@/shared/hooks/useTableChanges"
import { useTableDataCopy } from "@/shared/hooks/useTableDataCopy"
import { Routes } from "@/shared/lib/routes"

const contometerSearchParams = z.object({
  cashRegisterId: z.string().optional(),
})

export const Route = createFileRoute("/(sidebar)/detail-boxes/contometer")({
  component: RouteComponent,
  validateSearch: contometerSearchParams,
  staticData: {
    headerTitle: "Lista de contometros",
  },
})

function RouteComponent() {
  const { cashRegisterId } = Route.useSearch()
  const { data, isLoading, isFetching } =
    useGetContometersByReport(cashRegisterId)

  const { localData, originalData } = useTableDataCopy(data)

  const { getChanges } = useTableChanges(
    originalData,
    (item) => item.id,
    (item, original) => item.finalCm !== original.finalCm,
    (item) => ({ id: item.id, finalCm: item.finalCm }),
  )

  const editContometers = useEditContometers()
  const table = useDataTable({
    data: localData,
    columns: contometerColumns,
    isLoading: isLoading || isFetching,
  })

  const handleSave = () => {
    const current = table.getCoreRowModel().rows.map((row) => row.original)
    const tableChanges = getChanges(current)

    if (!tableChanges.length) return toast.info("No hay cambios para guardar")
    editContometers.mutate(tableChanges)
  }
  return (
    <>
      <HeaderContent>
        <HeaderContent.Right>
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "header" }),
            )}
            to={Routes.DetailBoxes}
          >
            <ChevronLeft />
            Regresar
          </Link>
          <Button size="header" onClick={() => alert("Editar contometro")}>
            <Edit />
            Editar
          </Button>
          <Button size="header" onClick={handleSave}>
            Guardar cambios
          </Button>
        </HeaderContent.Right>
      </HeaderContent>
      <DataTable table={table} className="flex-1" />
    </>
  )
}
