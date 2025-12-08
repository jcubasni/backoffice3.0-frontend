import { useNavigate } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { FileText, Lock, LockOpen, Package, PencilRuler } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TooltipButton } from "@/shared/components/ui/tooltip-button"
import { formatDateTime } from "@/shared/lib/date"
import { Routes } from "@/shared/lib/routes"
import { useModalStore } from "@/shared/store/modal.store"
import { DailyReport } from "../../types/daily-report.type"

export const dailyReportColumns: ColumnDef<DailyReport>[] = [
  {
    header: "Periodo de parte diario",
    accessorKey: "period",
  },
  {
    header: "Fecha de apertura",
    accessorFn: (row) => formatDateTime(row.openedAt),
  },
  {
    header: "Fecha de cierre",
    accessorFn: (row) => (row.closedAt ? formatDateTime(row.closedAt) : ""),
  },
  {
    header: "Estado de cajas",
    cell: ({ row }) => {
      const allLiquidated = row.original.allLiquidated
      const navigate = useNavigate()
      return (
        <Badge
          variant={allLiquidated ? "red" : "amber"}
          onClick={() => {
            if (allLiquidated) return
            navigate({
              to: Routes.DetailBoxes,
              search: {
                dailyReportId: row.original.id,
                period: row.original.period,
              },
            })
          }}
        >
          {allLiquidated ? "Liquidadas" : "Pendientes"}
        </Badge>
      )
    },
  },
  {
    header: "Estado",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.closedAt ? "red" : "blue"}>
          {row.original.closedAt ? "Cerrada" : "Abierta"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    size: 0,
    cell: ({ row: { original } }) => {
      const openModal = useModalStore((state) => state.openModal)
      return (
        <TooltipButton.Box>
          <TooltipButton
            tooltip="Cajas"
            onClick={() => {
              openModal("modal-boxes", original)
            }}
            icon={Package}
          />
          <TooltipButton
            tooltip="Varillaje"
            to={Routes.Dipstick}
            search={{ id: original.id }}
            icon={PencilRuler}
          />
          <TooltipButton
            tooltip="Ver PDF"
            to={Routes.PdfDailyReport}
            search={{ dailyReportId: original.id }}
            icon={FileText}
          />
          <TooltipButton
            tooltip={original.closedAt ? "Abrir reporte" : "Cerrar reporte"}
            disabled={!original.allLiquidated}
            onClick={() => {
              if (original.closedAt) return
              openModal("modal-close-daily-report", original)
            }}
            icon={original.closedAt ? LockOpen : Lock}
          />
        </TooltipButton.Box>
      )
    },
  },
]
