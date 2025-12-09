import { createFileRoute } from "@tanstack/react-router"
import { BadgePlus, Download, Edit2, FileText, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { ModalContainer } from "@/shared/components/modals/modal-container"
import { Modals } from "@/app/accounts/types/modals-name"
import { useGetClients } from "@/app/accounts/hooks/useClientsService"
import { Button } from "@/components/ui/button"
import { HeaderContent } from "@/shared/components/header-content"
import { DataTable } from "@/shared/components/ui/data-table"
import { Input } from "@/shared/components/ui/input"
import { useDataTable } from "@/shared/hooks/useDataTable"
import { useDebounce } from "@/shared/hooks/useDebounce"
import { useSearch } from "@/shared/hooks/useSearch"
import { useModalStore } from "@/shared/store/modal.store"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"

export const Route = createFileRoute("/(sidebar)/vehicle/vehicles")({
  component: RouteComponent,
  staticData: {
    headerTitle: "Vehículos",
  },
})

type VehicleRow = {
  licensePlate: string
  vehicleType: string
  cardNumber?: string
  model?: string
  tankCapacity?: number
  numberOfWheels?: number
  initialKilometrage?: number
  clientName?: string
  clientDocument?: string
}

function RouteComponent() {
  const [search, setSearch] = useDebounce("")
  const { isLoading, data: clients } = useGetClients()

  // Extraer vehículos desde la respuesta de clients (si existe la propiedad 'vehicles')
  const initialVehicles = useMemo(() => {
    if (!clients) return []
    return clients.flatMap((client) => {
      // some API responses may not include vehicles — guardamos safe access
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vehs = (client as any).vehicles ?? []
      return vehs.map((v: any) => ({
        ...v,
        clientName: `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim(),
        clientDocument: client.documentNumber ?? undefined,
      })) as VehicleRow[]
    })
  }, [clients])

  // Estado local para permitir agregar/editar/eliminar en la UI
  const [vehicles, setVehicles] = useState<VehicleRow[]>(initialVehicles)

  // Mantener sincronía si la fuente cambia: solo inicializamos cuando cambie la fuente
  // (evitamos sobrescribir ediciones locales mientras el usuario trabaja)
  // Si prefieres siempre sobrescribir, podrías usar effect para setVehicles(initialVehicles).

  const filteredVehicles = useSearch(vehicles, search, [
    "licensePlate",
    "model",
    "clientName",
  ])

  const table = useDataTable({
    columns: getColumns({ setVehicles }),
    data: filteredVehicles,
    isLoading: isLoading,
  })

  const { openModal } = useModalStore()

  const handleOpenNew = () => {
    openModal(Modals.ADD_VEHICLE, {
      addVehicle: (data: VehicleRow) => {
        setVehicles((prev) => [...prev, data])
      },
    } as any)
  }

  return (
    <>
     <HeaderContent>

  {/* Búsqueda */}
  <HeaderContent.Left>
    <Input
      label="Buscar vehículo"
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
      onClick={handleOpenNew}
    >
      <BadgePlus className="mr-2 h-4 w-4" />
      Nuevo
    </Button>

  </HeaderContent.Right>

</HeaderContent>


      <DataTable table={table} />

      {/* Modal container para los modales requeridos (solo ADD_VEHICLE usado aquí) */}
      <ModalContainer
        modals={[
          {
            modalId: Modals.ADD_VEHICLE,
            component: () =>
              import(
                "@/app/accounts/components/modals/modal-client/modal-add-vehicle"
              ),
          },
        ]}
      />
    </>
  )
}

/* Columnas locales para la tabla de vehículos */
function getColumns({
  setVehicles,
}: {
  setVehicles: React.Dispatch<React.SetStateAction<VehicleRow[]>>
}): ColumnDef<VehicleRow>[] {
  return [
    {
      accessorKey: "licensePlate",
      header: "Placa",
    },
    {
      accessorKey: "vehicleType",
      header: "Tipo",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      accessorKey: "cardNumber",
      header: "Tarjeta",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      accessorKey: "model",
      header: "Modelo",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      accessorKey: "clientName",
      header: "Cliente",
      cell: ({ getValue }) => getValue() ?? "-",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const index = row.index
        const rowData = row.original
        const handleEdit = () => {
          useModalStore.getState().openModal(Modals.ADD_VEHICLE, {
            editVehicle: (idx: number, data: VehicleRow) => {
              setVehicles((prev) => {
                const copy = [...prev]
                copy[idx] = data
                return copy
              })
            },
            index,
            vehicleData: rowData,
          } as any)
        }
        const handleDelete = () => {
          setVehicles((prev) => prev.filter((_, i) => i !== index))
        }
        return (
          <TooltipButton.Box>
            <TooltipButton tooltip="Editar" icon={Edit2} onClick={handleEdit} />
            <TooltipButton tooltip="Eliminar" icon={Trash2} onClick={handleDelete} />
          </TooltipButton.Box>
        )
      },
    },
  ]
}