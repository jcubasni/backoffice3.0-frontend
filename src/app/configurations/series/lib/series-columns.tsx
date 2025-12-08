import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatDate } from "@/shared/lib/date"
import { toCapitalize } from "@/shared/lib/words"
import { useModalStore } from "@/shared/store/modal.store"
import { SeriesResponse } from "../types/series.type"

export const seriesColumns: ColumnDef<SeriesResponse>[] = [
  {
    header: "Tipo Documento",
    accessorFn: (row) => toCapitalize(row.document?.description),
    enableHiding: false,
  },
  {
    header: "N° Serie",
    accessorKey: "seriesNumber",
    enableHiding: false,
  },
  {
    header: "Correlativo",
    accessorKey: "correlativeCurrent",
    enableHiding: false,
  },
  {
    header: "Sucursal",
    accessorKey: "local.localName",
  },
  {
    header: "Grupo",
    accessorKey: "groupSerie.description",
    accessorFn: (row) => row.groupSerie?.description ?? "Sin Grupo",
    cell: ({ row }) => {
      const item = row.original
      return (
        <Badge variant={item.groupSerie ? "green" : "blue"}>
          {item.groupSerie?.description ?? "Libre"}
        </Badge>
      )
    },
  },
  {
    header: "Descripción",
    accessorKey: "description",
  },
  {
    header: "Fecha de creación",
    accessorFn: (row) => formatDate(row.createdAt),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original
      const openModal = useModalStore.getState().openModal

      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Editar"
            onClick={() => openModal("modal-edit-series", item)}
            icon={Edit}
          />
          <TooltipButton
            tooltip="Eliminar"
            onClick={() => openModal("modal-delete-series", item.id)}
            icon={Trash}
          />
        </TooltipButton.Box>
      )
    },
  },
]
